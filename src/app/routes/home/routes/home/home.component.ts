import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MenuItemDef } from 'ag-grid-community';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

import { ApiService } from '$api';
import { UIStoreService } from '$ui';
import { columns } from './columns';

@AutoUnsubscribe()
@Component({
  selector: 'app-home',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {
  public columns = columns;
  public gridState: GridState = {};
  public gridOptions = {};
  public gridFilterTerm = '';
  public gridRowsSelected: Models.User[];

  public users: Models.User[];
  public users$ = this.api.select.users$;
  public formMain: FormGroup;
  public isEditing: boolean;
  public sidebarOpen = false;

  constructor(private api: ApiService, public ui: UIStoreService, private fb: FormBuilder) {}

  public ngOnInit() {
    // Get users and load into store
    this.api.users.get().subscribe(users => (this.users = users));

    // Rehydrate grid from UI state
    this.ui.select.gridState$.subscribe(gridState => {
      // Make sure this isn't the multiscreen originator and that the new state passed down doesn't match the current state
      if (!this.ui.screen && gridState !== this.gridState) {
        this.gridState = gridState;
        if (this.gridState.columns) {
          this.columns = this.gridState.columns;
        }
      }
    });

    // Formgroup
    this.formMain = this.fb.group({
      address: ['', []],
      company: ['', []],
      email: ['', []],
      id: ['', []],
      name: ['', [Validators.required]],
      phone: ['', []],
      username: ['', [Validators.required]],
      website: ['', []],
    });
  }

  public doCoolStuff(test: any) {
    console.log(test);
  }

  /**
   * Create the context menu
   * @param params
   */
  public gridContextMenu(params: any) {
    // console.log(params.value, params.node.data) // Cell value and row object
    return <MenuItemDef[]>[
      'copy',
      'copyWithHeaders',
      'paste',
      'separator',
      {
        name: 'Tags',
        icon: '<i class="fa fa-tags"></i>',
        subMenu: [
          {
            name: 'Red',
            icon: '<i class="fa fa-tag red"></i>',
            action: function() {
              params.context.this.gridContextAction(params.value, params.node.data);
            },
          },
          {
            name: 'Green',
            icon: '<i class="fa fa-tag green"></i>',
            action: function() {
              params.context.this.gridContextAction(params.value, params.node.data);
            },
          },
        ],
      },
      'separator',
      'export',
    ];
  }

  /**
   * Generate custom navigation links for the grid column dropdown menu
   * @param params
   */
  public gridCustomLinks = (params: any) => {
    const self = this;
    // Get current menu items
    const currentMenu: (string | MenuItemDef)[] = params.defaultItems.slice(0);
    // Get current column ID. Useful for individual custom column menus. IE if (columnId === 'someProp') ...
    const columnId = params.column.getId();
    // Insert before the reset columns element which is last
    currentMenu.splice(currentMenu.length - 2, 0, 'separator');
    currentMenu.splice(currentMenu.length - 2, 0, {
      name: 'Chart This Column',
      subMenu: [
        {
          name: 'Pie Chart',
          icon: '<i class="fa fa-pie-chart"></i>',
          action: function() {
            self.gridMenuAction((<any>this).name, columnId);
          },
        },
        {
          name: 'Bar Chart',
          icon: '<i class="fa fa-bar-chart"></i>',
          action: function() {
            self.gridMenuAction((<any>this).name, columnId);
          },
        },
      ],
    });
    return currentMenu;
  };

  /**
   * An action to perform from a custom link on the grid column menu
   * @param actionType
   * @param columnId
   */
  public gridMenuAction(actionType: string, columnId: string) {
    console.log(actionType, columnId);
  }

  /**
   * An action to perform on a context menu click
   * @param params
   */
  public gridContextAction(value: string, row: any) {
    console.log(value, row);
  }

  /** Save the grid state */
  public gridStateSave(gridState: GridState) {
    this.gridState = gridState;
    this.ui.gridStateChange(gridState);
  }

  /** When rows are selected in the grid */
  public rowsSelected(rows: Models.User[]) {
    this.userEdit(rows[0]);
  }

  /**
   * Create/update user
   */
  public userSubmit() {
    // If editing, use put
    if (this.isEditing) {
      this.api.users.put(this.formMain.value).subscribe(() => {
        this.formMain.reset(); // Reset form after completion
        this.isEditing = false;
      });
    } else {
      // If creating, use post
      this.api.users.post(this.formMain.value).subscribe(() => this.formMain.reset());
    }
  }

  /**
   * Refresh users
   */
  public usersRefresh() {
    this.api.users.get(true).subscribe();
  }

  /**
   * Stop editing to create a new user
   */
  public userStopEdit() {
    this.formMain.reset();
    this.isEditing = false;
  }

  /**
   * Load user into editing pane
   * @param user
   */
  public userEdit(user: Models.User) {
    this.formMain.patchValue(user);
    this.isEditing = true;
  }

  /**
   * Delete user
   * @param user
   */
  public userDelete(id: number) {
    const user = this.users.filter(user2 => user2.id === id)[0];
    this.api.users.delete(user).subscribe();
  }

  // Must be present even if not used for unsubs
  ngOnDestroy() {}
}

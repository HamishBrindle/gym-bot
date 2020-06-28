<template>
  <div class="users-list__wrapper">
    <v-container class="users-list">
      <v-row>
        <v-col>
          <span class="display-1 font-weight-light">{{ title }}</span>
        </v-col>
      </v-row>
      <v-card
        class="users-list__card"
        elevation="0"
        outlined
      >
        <v-skeleton-loader
          v-show="loading.table"
          type="table-tbody"
          width="100%"
          height="100%"
        />
        <v-data-table
          v-show="!loading.table"
          :headers="headers"
          :items="data"
          disable-sort
          disable-pagination
          hide-default-footer
        />
      </v-card>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Loading } from '@/lib/types';
import { User } from '@/models/User';
import { UserService } from '@/services';
import { DataTableHeader } from 'vuetify';
import { ITableView } from '@/lib/interfaces';
import Logger from '@/tools/Logger';
import moment from 'moment';

@Component({
  name: 'UsersList',
})
export default class UsersList extends Vue implements ITableView<User> {
  /**
   * Title to be displayed at top of component/view
   */
  private readonly title = 'Users';

  /**
   * User Service
   */
  private readonly userService: UserService = UserService.getInstance();

  /**
   * Loading state handlers
   */
  private readonly loading: Loading = {
    table: false,
  }

  data: User[] = [];

  selected: User[] = [];

  headers: DataTableHeader[] = [
    { text: 'ID', value: 'id' },
    { text: 'Email', value: 'email' },
    { text: 'Created At', value: 'createdAt' },
    { text: 'Updated At', value: 'updatedAt' },
    { text: 'First Name', value: 'firstName' },
    { text: 'Last Name', value: 'lastName' },
  ];

  created() {
    this.init();
  }

  async fetchData() {
    const user = this.userService.getActive();
    if (!user) throw Error('Unable to find active User');
    return this.userService.api.find({
      accessToken: user.accessToken ?? '',
    });
  }

  async init() {
    this.loading.table = true;
    try {
      const { data } = await this.fetchData();
      console.log('data :>> ', data);
      await this.userService.insert({ data });
      this.data = this.userService
        .all()
        .sort((a: any, b: any) => a.id - b.id)
        .map((user: any) => ({
          ...user,
          createdAt: moment(user.createdAt).format('YYYY MMM DD'),
          updatedAt: moment(user.updatedAt).format('YYYY MMM DD'),
        }));
    } catch (error) {
      Logger.error(error);
    } finally {
      this.loading.table = false;
    }
  }
}
</script>

<style lang="scss">
.users-list {
  &__card {
    padding: 1rem;
  }
}
</style>

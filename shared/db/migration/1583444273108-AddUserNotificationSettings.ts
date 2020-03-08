/* eslint-disable @typescript-eslint/no-explicit-any */
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddUserNotificationSettings1583444273108
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumns('user', [
      new TableColumn({
        name: 'enableNotifications',
        type: 'boolean',
        default: true,
      }),
      new TableColumn({
        name: 'enableTransactionAlert',
        type: 'boolean',
        default: true,
      }),
      new TableColumn({
        name: 'enableMonthlyReport',
        type: 'boolean',
        default: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn('user', 'enableNotifications');
    await queryRunner.dropColumn('user', 'enableTransactionAlert');
    await queryRunner.dropColumn('user', 'enableMonthlyAlert');
  }
}

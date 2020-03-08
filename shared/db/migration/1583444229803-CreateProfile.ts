/* eslint-disable @typescript-eslint/no-explicit-any */
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateProfile1583444229803 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'profile',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'accountIdsStr',
            type: 'varchar',
          },
          {
            name: 'name',
            type: 'varchar',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('profile');
  }
}

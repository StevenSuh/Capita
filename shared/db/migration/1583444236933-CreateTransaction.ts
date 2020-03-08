/* eslint-disable @typescript-eslint/no-explicit-any */
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTransaction1583444236933 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'transaction',
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
            name: 'accountId',
            type: 'int',
          },
          {
            name: 'plaidTransactionId',
            type: 'varchar',
            isUnique: true,
            isNullable: true,
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'category',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'type',
            type: 'varchar',
          },
          {
            name: 'amount',
            type: 'decimal',
          },
          {
            name: 'isoCurrencyCode',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'unofficialCurrencyCode',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'date',
            type: 'varchar',
          },
          {
            name: 'note',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'pending',
            type: 'boolean',
            default: false,
          },
          {
            name: 'recurring',
            type: 'boolean',
            default: false,
          },
          {
            name: 'manuallyCreated',
            type: 'boolean',
            default: false,
          },
          {
            name: 'hidden',
            type: 'boolean',
            default: false,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['accountId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'account',
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('transaction');
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateAccount1583274422159 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'account',
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
            name: 'linkId',
            type: 'int',
          },
          {
            name: 'plaidAccountId',
            type: 'varchar',
            isUnique: true,
            isNullable: true,
          },
          {
            name: 'mask',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'officialName',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'subtype',
            type: 'varchar',
          },
          {
            name: 'type',
            type: 'varchar',
          },
          {
            name: 'verificationStatus',
            type: 'varchar',
          },
          {
            name: 'balanceAvailable',
            type: 'decimal',
            isNullable: true,
          },
          {
            name: 'balanceCurrent',
            type: 'decimal',
          },
          {
            name: 'balanceLimit',
            type: 'decimal',
            isNullable: true,
          },
          {
            name: 'balanceIsoCurrencyCode',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'balanceUnofficialCurrencyCode',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'manuallyCreated',
            type: 'boolean',
          },
          {
            name: 'hidden',
            type: 'boolean',
          },
          {
            name: 'needsUpdate',
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
            columnNames: ['linkId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'link',
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('account');
  }
}

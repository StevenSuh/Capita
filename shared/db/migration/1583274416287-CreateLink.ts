/* eslint-disable @typescript-eslint/no-explicit-any */
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateLink1583274416287 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'link',
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
            name: 'accessToken',
            type: 'varchar',
          },
          {
            name: 'plaidItemId',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'plaidInstitutionId',
            type: 'varchar',
          },
          {
            name: 'institutionName',
            type: 'varchar',
          },
          {
            name: 'institutionUrl',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'institutionLogo',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'ready',
            type: 'boolean',
            default: false,
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
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('link');
  }
}

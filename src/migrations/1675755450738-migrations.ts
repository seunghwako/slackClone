import { MigrationInterface, QueryRunner } from 'typeorm';

export class categoryToType1675755450738 implements MigrationInterface {
  name = 'categoryToType1675755450738';
  // 마이그레이션 로직
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `mentions` RENAME COLUMN `category` TO `type`',
    );
  }

  //롤백시 로직
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `mentions` RENAME COLUMN `type` TO `category`',
    );
  }
}

import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateUserTable1630347999209 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE user (
                id INT NOT NULL AUTO_INCREMENT,
                firstName VARCHAR(255) NOT NULL,
                lastName VARCHAR(255) NOT NULL,
                age INT NOT NULL,
                PRIMARY KEY (id)
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE user
        `);
    }

}

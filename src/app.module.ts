import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { RecordsModule } from './records/records.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true, // This fixes the UndefinedDependencyException globally
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        autoLoadEntities: true, // Automatically find your @Entity() classes
        synchronize: true, // Set to false in production!

        // IMPORTANT FOR SUPABASE:
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false, // Required for some hosted Postgres environments
          },
        },
      }),
      inject: [ConfigService],
    }),

    RecordsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

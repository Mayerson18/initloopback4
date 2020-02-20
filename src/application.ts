import { BootMixin } from '@loopback/boot';
import { ApplicationConfig, BindingKey } from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import { RepositoryMixin, juggler } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { ServiceMixin } from '@loopback/service-proxy';
import path from 'path';
import { MySequence } from './sequence';
import { DbDataSource } from './datasources';
import { AuthenticationComponent, registerAuthenticationStrategy } from '@loopback/authentication';
import { AuthorizationComponent } from '@loopback/authorization';
import { SECURITY_SCHEME_SPEC } from './utils/security-spec';
import { TokenServiceBindings, TokenServiceConstants, PasswordHasherBindings, UserServiceBindings } from './keys';
import { JWTService } from './services/jwt-service';
import { BcryptHasher } from './services/hash.password.bcryptjs';
import { MyUserService } from './services/user.service';
import { JWTAuthenticationStrategy } from './authentication-strategies/jwt-strategy';
require('dotenv').config();


export interface PackageInfo {
  name: string;
  version: string;
  description: string;
}
export const PackageKey = BindingKey.create<PackageInfo>('application.package');

const pkg: PackageInfo = require('../package.json');

export class PresidenciaApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.api({
      openapi: '3.0.0',
      info: { title: pkg.name, version: pkg.version },
      paths: {},
      components: { securitySchemes: SECURITY_SCHEME_SPEC },
      servers: [{ url: '/' }],
    });

    this.setUpBindings();

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.bind(RestExplorerBindings.CONFIG).to({
      path: '/explorer',
    });

    this.component(AuthenticationComponent);
    this.component(AuthorizationComponent);
    this.component(RestExplorerComponent);

    registerAuthenticationStrategy(this, JWTAuthenticationStrategy);

    this.sequence(MySequence);


    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    this.bindMysql();
    this.setupDatasources();
  }

  setUpBindings(): void {
    // Bind package.json to the application context
    this.bind(PackageKey).to(pkg);

    this.bind(TokenServiceBindings.TOKEN_SECRET).to(
      TokenServiceConstants.TOKEN_SECRET_VALUE,
    );

    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE,
    );

    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);

    // // Bind bcrypt hash services
    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);

    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService);
  }

  bindMysql() {
    console.log('procces.env :', process.env.MYSQL_DB_HOST);
    this.bind('datasources.config.db').to({
      name: 'db',
      connector: 'mysql',
      host: process.env.MYSQL_DB_HOST,
      port: process.env.MYSQL_DB_PORT,
      user: process.env.MYSQL_DB_USER,
      password: process.env.MYSQL_DB_PASSWORD,
      database: process.env.MYSQL_DB_DATABASE,
      insecureAuth: true,

    });
    this.bind('datasources.db').toClass(DbDataSource);
  }

  setupDatasources() {
    const datasource =
      this.options && this.options.datasource
        ? new juggler.DataSource(this.options.datasource)
        : DbDataSource;
    this.dataSource(datasource);
  }
}

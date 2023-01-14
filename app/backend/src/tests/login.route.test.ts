import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';
import Users from '../database/models/users.model';

import { Response } from 'superagent';

import { userAdmin } from './mock/user.mock';
import jwt from '../helpers/jwt.helper';
import bcrypt from '../helpers/bcrypt.helper';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('Teste da rota /login', () => {
  before(async () => {
    sinon
      .stub(Users, "findOne")
       .resolves(userAdmin as Users)
  });

  after(()=>{
    (Users.findOne as sinon.SinonStub).restore();
  })

  it('verificando se com email e senha correta a aplicação loga e retorna um token', async () => {
    sinon
    .stub(jwt, "tokenGenerator")
    .returns('token');

    const body = {
      email: "admin@admin.com",
      password: "secret_admin"
    }
    
    const chaiHttpResponse = await chai.request(app).post('/login').send(body);
  
    const expectResponse = {
      token: 'token'
    }
  
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(expectResponse);

    (jwt.tokenGenerator as sinon.SinonStub).restore();
  });

  it('verificando se com uma senha invalida a aplicação retorna um erro', async () => {
    sinon
      .stub(bcrypt, "comparePassword")
      .returns(false)
  
    const body = {
      email: "admin@admin.com",
      password: "senhaerrada123"
    }
    
    const chaiHttpResponse = await chai.request(app).post('/login').send(body);
  
    const expectResponse = {
      message: 'Incorrect email or password'
    }
  
    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body).to.be.deep.equal(expectResponse);

    (bcrypt.comparePassword as sinon.SinonStub).restore();
  });

  it('verificando se SEM email a aplicação retorna um erro', async () => {
    const body = {
      email: "",
      password: "secret_admin"
    }
    
    const chaiHttpResponse = await chai.request(app).post('/login').send(body);
  
    const expectResponse = {
      message: 'All fields must be filled'
    }
  
    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body).to.be.deep.equal(expectResponse);
  });

  it('verificando se com email invalido a aplicação retorna um erro', async () => {
    const body = {
      email: "emailnaovalido",
      password: "secret_admin"
    }
    
    const chaiHttpResponse = await chai.request(app).post('/login').send(body);
  
    const expectResponse = {
      message: 'Incorrect email or password'
    }
  
    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body).to.be.deep.equal(expectResponse);
    
  });

  it('verificando se retorna erro caso o banco não tenha o email informado', async () => {
    (Users.findOne as sinon.SinonStub).restore();
    sinon
      .stub(Users, "findOne")
      .resolves(null)

    const body = {
      email: "email@nao.com",
      password: "secret_admin"
    }

    const chaiHttpResponse = await chai.request(app).post('/login').send(body);

    const expectResponse = {
      message: 'Incorrect email or password'
    }
  
    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body).to.be.deep.equal(expectResponse);
  });

  it('verificando se SEM senha a aplicação retorna um erro', async () => {
    const body = {
      email: "admin@admin.com",
      password: ""
    }
    
    const chaiHttpResponse = await chai.request(app).post('/login').send(body);
  
    const expectResponse = {
      message: 'All fields must be filled'
    }
  
    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body).to.be.deep.equal(expectResponse);
  });


});

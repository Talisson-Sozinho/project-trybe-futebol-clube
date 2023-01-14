import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';
import Users from '../database/models/users.model';
import jwt from '../helpers/jwt.helper'

import { Response } from 'superagent';

import { normalUser, userAdmin } from './mock/user.mock';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('Teste da rota /login/validate', () => {
  afterEach(()=>{
    (Users.findOne as sinon.SinonStub).restore();
    (jwt.tokenGenerator as sinon.SinonStub).restore();
    (jwt.tokenValidator as sinon.SinonStub).restore();
  })

  it('Verifica se ao acessar a rota, ela responde a role certa: case "admin"', async () => {
    sinon
     .stub(Users, "findOne")
     .resolves(userAdmin as Users)

    sinon.stub(jwt, 'tokenGenerator').returns('validToken');
    sinon.stub(jwt, 'tokenValidator').returns({ user: userAdmin});
    

    const body = {
      email: "admin@admin.com",
      password: "secret_admin"
    }
    
    const { body: { token } } = await chai.request(app).post('/login').send(body);

    const chaiHttpResponse = await chai.request(app).get('/login/validate').set('Authorization', token);
  
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal({ role: 'admin' });
  });

  it('Verifica se ao acessar a rota, ela responde a role certa: case "user"', async () => {

    sinon.stub(Users, "findOne").resolves(normalUser as Users)
    sinon.stub(jwt, 'tokenGenerator').returns('validToken');
    sinon.stub(jwt, 'tokenValidator').returns({ user: normalUser});

    const body = {
      email: "user@user.com",
      password: "secret_user"
    }
    
    const { body: { token } } = await chai.request(app).post('/login').send(body);

    const chaiHttpResponse = await chai.request(app).get('/login/validate').set('Authorization', token);
  
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal({ role: 'user' });
  });

});
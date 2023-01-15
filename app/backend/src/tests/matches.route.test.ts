import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';
import Matches from '../database/models/matches.model';
import { allMatches } from './mock/matches.mock';
import jwt from '../helpers/jwt.helper';
import { userAdmin } from './mock/user.mock';
import Teams from '../database/models/teams.model';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('Teste da rota /matches', () => {
  it('Verifica se ao acessar a rota, ela responde com a lista de todos as partidas', async () => {
    sinon.stub(Matches, "findAll").resolves(allMatches as Matches[]);
    
    const  chaiHttpResponse = await chai.request(app).get('/matches');
  
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(allMatches);

    (Matches.findAll as sinon.SinonStub).restore();
  });

  it('Verifica se ao acessar a rota com query, faz o filtro corretamente', async () => {
    const matchesInProgress = allMatches.filter(({inProgress}) => inProgress === true);

    sinon.stub(Matches, "findAll").resolves( matchesInProgress as Matches[]);

    const  chaiHttpResponse = await chai.request(app).get('/matches').query('inProgress=true');

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(allMatches.filter(({inProgress}) => inProgress === true));

    (Matches.findAll as sinon.SinonStub).restore();
  });

  it('Verifica se retornar query invalida caso seja um query invalida', async () => {
    const  chaiHttpResponse = await chai.request(app).get('/matches').query('inProgress=invalid');

    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body).to.be.deep.equal({message: 'query unknown'});
  });

  it('Verificando se é possível cadastrar uma partida nova', async () => {
    const newMatch = {
      id: 1,
      homeTeam: 16,
      homeTeamGoals: 2,
      awayTeam: 8,
      awayTeamGoals: 2,
      inProgress: true,
    }
    const body = {
      homeTeam: 16,
      awayTeam: 8,
      homeTeamGoals: 2,
      awayTeamGoals: 2,
    }

    sinon.stub(Matches, "create").resolves(newMatch as Matches);

    sinon.stub(jwt, 'tokenGenerator').returns('validToken');
    sinon.stub(jwt, 'tokenValidator').returns({user: userAdmin});

    const { body: { token } } = await chai.request(app).post('/login').send({
      email: "user@user.com",
      password: "secret_user"
    });

    const  chaiHttpResponse = await chai.request(app).post('/matches').send(body).set('Authorization', token);

    expect(chaiHttpResponse.status).to.be.equal(201);
    expect(chaiHttpResponse.body).to.be.deep.equal(newMatch);

    (Matches.create as sinon.SinonStub).restore();
    (jwt.tokenGenerator as sinon.SinonStub).restore();
    (jwt.tokenValidator as sinon.SinonStub).restore();
  });

  it('Verifica se não é possível cadastrar dois times iguais em uma partida', async () =>{
    const body = {
      homeTeam: 16,
      awayTeam: 16,
      homeTeamGoals: 2,
      awayTeamGoals: 2,
    }

    sinon.stub(jwt, 'tokenGenerator').returns('validToken');
    sinon.stub(jwt, 'tokenValidator').returns({user: userAdmin});

    const { body: { token } } = await chai.request(app).post('/login').send({
      email: "user@user.com",
      password: "secret_user"
    });

    const  chaiHttpResponse = await chai.request(app).post('/matches').send(body).set('Authorization', token);

    expect(chaiHttpResponse.status).to.be.equal(422);
    expect(chaiHttpResponse.body).to.be.deep.equal({message: 'It is not possible to create a match with two equal teams'});

    (jwt.tokenGenerator as sinon.SinonStub).restore();
    (jwt.tokenValidator as sinon.SinonStub).restore();
  });

  it('Verifica se não é possível cadastrar times que não existem no banco', async () =>{
    sinon.stub(Teams, "findAll").resolves([]);
  
    const body = {
      homeTeam: 89998,
      awayTeam: 99999,
      homeTeamGoals: 2,
      awayTeamGoals: 2,
    }


    sinon.stub(jwt, 'tokenGenerator').returns('validToken');
    sinon.stub(jwt, 'tokenValidator').returns({user: userAdmin});

    const { body: { token } } = await chai.request(app).post('/login').send({
      email: "user@user.com",
      password: "secret_user"
    });

    const  chaiHttpResponse = await chai.request(app).post('/matches').send(body).set('Authorization', token);

    expect(chaiHttpResponse.status).to.be.equal(404);
    expect(chaiHttpResponse.body).to.be.deep.equal({message: 'There is no team with such id!'});

    (Teams.findAll as sinon.SinonStub).restore();
    (jwt.tokenGenerator as sinon.SinonStub).restore();
    (jwt.tokenValidator as sinon.SinonStub).restore();
  });

  it('Verificando se é possível terminar uma partida', async () => {
    sinon.stub(Matches, "update").resolves([1]);
    sinon.stub(jwt, 'tokenValidator').returns({user: userAdmin});

    const token = 'validToken';

    const  chaiHttpResponse = await chai.request(app).patch('/matches/1/finish').set('Authorization', token);

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal({message: 'Finished'});

    (Matches.update as sinon.SinonStub).restore();
    (jwt.tokenValidator as sinon.SinonStub).restore();
  });

  it('Verificando se é possível terminar uma partida', async () => {
    sinon.stub(Matches, "update").resolves([1]);


    const  chaiHttpResponse = await chai.request(app).patch('/matches/1').send({
      homeTeamGoals: 3,
      awayTeamGoals: 1
    });

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal({message: 'Updated'});

    (Matches.update as sinon.SinonStub).restore();
  });

});
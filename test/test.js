/* eslint-disable no-undef */
//  Test para probar mocha framework
const assert = require('assert');
const createAsunto = require('../services/createAsunto');
const connection = require('../config/database');
const getAsuntos = require('../app/getAsuntos');
const getAllAsuntos = require('../app/getAllAsuntos');
const getSubordinados = require('../app/getSubordinados');
const getSubordinadosAsignados = require('../app/getSubordinadosAsignados');
const createActividad = require('../services/createActividad');
const concluirAsunto = require('../services/concluirAsunto');
describe('Tests de creacion de asunto', () => {
  it('Debe crear un asunto con el titulo Test y descripcion Test unitario con 0 dias de termino', () => {
    createAsunto({
      body: {
        Actividad: 'Test',
        Descripcion: 'Test unitario',
        DiasTermino: 0,
        RFCS: 'null'
      }
    });
    connection.query('select Actividad from asunto where Actividad = "Test" and Descripcion = "Test unitario"', function (_err, _rows) {
      assert.strictEqual(_rows[0].Actividad, 'Test');
    });
  });
});

describe('Tests de creacion de actividad', () => {
  it('Debe crear una Actividad con el titulo Test y descripcion Test unitario para el asunto con id 0 con autor Subordinado de Ejemplo', () => {
    createActividad({
      body: {
        Nombre: 'Test',
        DescripcionActividad: 'Test unitario'
      }
    }, 0, 'SUBOR1');
    connection.query('select Nombre from actividad where Nombre = "Test" and Descripcion ="Test unitario"', function (_err, _rows) {
      assert.strictEqual(_rows[0].Nombre, 'Test');
    });
  });
});

describe('Tests de conclusion de asunto', () => {
  it('Debe concluir el asunto con el id  0', () => {
    concluirAsunto(0);
    connection.query('select Estado from asunto where idAsunto = 0', function (_err, _rows) {
      assert.strictEqual(_rows[0].Estado, 'Concluido.');
    });
  });
});

describe('Test de obtencion de asuntos', () => {
  it('Debe obtener los asuntos del subordinado de ejemplo', () => {
    getAsuntos({
      RFC: 'SUBOR1'
    }, (result) => {
      connection.query('select a.Actividad, a.Descripcion, a.IdAsunto, a.Estado, a.DiasTermino, s.RFC from asunto a, asuntosubordinado x, subordinado s where a.Estado="En progreso." and a.IdAsunto= x.IdAsunto and x.RFCS= s.RFC and s.RFC= "SUBOR1"', (_err, _rows) => {
        assert.deepStrictEqual(result, _rows);
      });
    });
  });
});

describe('Test de obtencion de todos los asuntos', () => {
  it('Debe obtener los asuntos del subordinado de ejemplo', () => {
    getAllAsuntos({
      RFC: 'SUBOR1'
    }, (result) => {
      connection.query('select a.* from asunto a, asuntosubordinado x, subordinado s where a.IdAsunto= x.IdAsunto and x.RFCS= s.RFC and s.RFCE="SUBOR1"', (_err, _rows) => {
        assert.deepStrictEqual(result, _rows);
      });
    });
  });
});

describe('Test de obtencion de los subordinados asignados a un asunto', () => {
  it('Debe obtener los subordinados de el asunto con id 7', () => {
    getSubordinadosAsignados(7, (result) => {
      connection.query('Select s.* from  subordinado s, asunto a, asuntosubordinado x where s.rfc=x.rfcs and x.idasunto=a.idasunto and a.idasunto=7', (_err, _rows) => {
        assert.deepStrictEqual(result, _rows);
      });
    });
  });
});

describe('Test de obtencion de subordinados', () => {
  it('Debe obtener los subordinados del encargado de ejemplo', () => {
    getSubordinados({
      RFC: 'FDSK45385'
    }, (result) => {
      connection.query("select * from subordinado where RFCE = 'FDSK45385'", (_err, _rows) => {
        assert.deepStrictEqual(result, _rows);
        try { connection.end(); } catch (e) {}
      });
      try { connection.end(); } catch (e) {}
    });
  });
});

const sinon = require('sinon');
const { expect } = require('chai');
const { climate_data, regions } = require('../../models');
const climateController = require('../../controllers/climateController');

describe('Climate Controller Unit Tests', () => {
  afterEach(() => sinon.restore());

  it('getAllClimateData() should return climate records', async () => {
    const req = {};
    const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

    const mockData = [
      {
        get: () => ({ id: 1, year: 2025, avg_temp: 23, co2_level: 400, precipitation: 10, region: { name: 'North' } })
      }
    ];

    sinon.stub(climate_data, 'findAll').resolves(mockData);

    await climateController.getAllClimateData(req, res);

    expect(res.json.calledOnce).to.be.true;
    expect(res.json.firstCall.args[0]).to.deep.equal([
      { id: 1, year: 2025, avg_temp: 23, co2_level: 400, precipitation: 10, region: 'North' }
    ]);
  });

  it('createClimateData() should create and return a new record', async () => {
    const req = { body: { year: 2025, region_id: 1, avg_temp: 23, co2_level: 400, precipitation: 10 } };
    const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

    const createdRecord = { id: 1, get: () => ({ ...req.body, id: 1 }) };
    sinon.stub(climate_data, 'create').resolves(createdRecord);
    sinon.stub(climate_data, 'findByPk').resolves({ ...createdRecord, region: { name: 'North' }, get: () => ({ ...req.body, id: 1, region: { name: 'North' } }) });

    await climateController.createClimateData(req, res);

    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
    expect(res.json.firstCall.args[0]).to.deep.equal({ ...req.body, id: 1, region: 'North' });
  });
});

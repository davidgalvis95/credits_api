import { before } from 'node:test';
import { configureApp } from './index';
import {
  Partner,
  addOrRemoveCreditsFromPartner,
  getPartnerCreditsBalance,
} from './models';

describe('Ledger', () => {
  // let app: Awaited<ReturnType<typeof configureApp>>['app'];
  let conn: Awaited<ReturnType<typeof configureApp>>['knexConnection'];
  let partnerAcme: Partner;

  let deactivate: Awaited<ReturnType<typeof configureApp>>['deactivate'];

  beforeAll(async () => {
    const configuredApp = await configureApp();
    conn = configuredApp.knexConnection;
    deactivate = configuredApp.deactivate;

    await conn.raw(`
			delete from partner;
		`);

    partnerAcme = await Partner.query(conn).insertAndFetch({
      name: 'Acme',
      slug: 'acme',
    });
  });

  beforeEach(async () => {
    // Reset partner credits
  });

  afterAll(async () => {
    await deactivate();
  });

  it('it should insert partner and retrieve partner', async () => {
    const partners = await conn
      .raw(
        `
					select *
					from partner
					limit 10
				`
      )
      .then((res) => res.rows);

    expect(partners).toStrictEqual([
      {
        id: partnerAcme?.id,
        name: 'Acme',
        slug: 'acme',
        created_at: partnerAcme?.created_at,
        updated_at: partnerAcme?.updated_at,
      },
    ]);
  });

  it.only('it should allow partners to top up (buy credits)', async () => {
    if (partnerAcme?.id == null) {
      throw new Error('partnerAcme.id is null');
    }

    const acmeCreditsBeforeUpdate = await getPartnerCreditsBalance({
      partnerId: partnerAcme?.id,
      conn,
    });

    expect(acmeCreditsBeforeUpdate).toBe(0);

    // Top up the partner with 100 credits
    await addOrRemoveCreditsFromPartner({
      partnerId: partnerAcme?.id,
      amountOfCredits: 100_00,
      conn,
    });

    const acmeCreditsAfterTopUp = await getPartnerCreditsBalance({
      partnerId: partnerAcme?.id,
      conn,
    });

    expect(acmeCreditsAfterTopUp).toBe(100_00);
  });

  it('it should not allow partner balance to go below 0', async () => {
    if (partnerAcme?.id == null) {
      throw new Error('partnerAcme.id is null');
    }

    const acmeCreditsBeforeUpdate = await getPartnerCreditsBalance({
      partnerId: partnerAcme?.id,
      conn,
    });

    expect(acmeCreditsBeforeUpdate).toBe(0);

    // Top up the partner with 100 credits
    await addOrRemoveCreditsFromPartner({
      partnerId: partnerAcme?.id,
      amountOfCredits: 100_00,
      conn,
    });

    const acmeCreditsAfterTopUp = await getPartnerCreditsBalance({
      partnerId: partnerAcme?.id,
      conn,
    });
    expect(acmeCreditsAfterTopUp).toBe(100_00);

    // TODO; Spend 80 credits from a booking
    // TODO; Assert the partner has 20 credits left
    // TODO; Spend another 80 credits from a booking
    // TODO; Assert you throw an error because the partner balance cannot go below 0
  });

  it.todo(
    'it should allow a partner to overdraft (go below 0 credits) if they have a credit limit'
  );
});

import { Model, TransactionOrKnex } from 'objection';

export class Partner extends Model {
  static tableName = 'partner';
  static idColumn = 'id';

  id!: string;
  created_at?: Date | string;
  updated_at?: Date | string;

  name!: string;
  slug!: string;
}

export class Transaction extends Model {
  static tableName = 'credit';
  static idColumn = 'id';

  id!: string;
  partner_id!: string;
  amount!: number;
  created_at?: Date | string;
  updated_at?: Date | string;

  name!: string;
  slug!: string;
}

export const getPartnerCreditsBalance = async ({
  partnerId,
  conn,
}: {
  partnerId: string;
  conn: TransactionOrKnex;
}): Promise<number> => {

  const currentBalance = await conn
  .raw(
    `
      select p.id, t.amount
      from partner p join transactions t
      on p.id=t.partner_id
      order by t.created_at desc
    `
  )
  .then((res) => res.rows);

  if(currentBalance.length == 0){
    return 0;
  }
  
  // TODO;
  return;
};

export const addOrRemoveCreditsFromPartner = async ({
  partnerId,
  amountOfCredits,
  conn,
}: {
  partnerId: string;
  amountOfCredits: number;
  conn: TransactionOrKnex;
}): Promise<void> => {
  // TODO;
  return;
};

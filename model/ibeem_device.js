var ibeemDeviceSqlMap = {
    add: 'insert into ibeem_device(did, created_on, updated_on) values(?, ?, ?)',
    selectByDid: 'select * from ibeem_device where did = ?',
};

module.exports = ibeemDeviceSqlMap;
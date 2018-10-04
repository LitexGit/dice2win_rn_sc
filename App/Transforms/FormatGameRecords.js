const GAME_TYPE = {
    2: 'coin',
    6: 'dice1',
    36: 'dice2',
    100: 'roll'
}
// time string: 2018-09-30 16:16:50.663
export default (records: object) => {
    let gameRecords = []
    records.map(r=>{
        let type = GAME_TYPE[r.modulo]
        let bet = r.bet_mask
        let in = r.amount / 10e8
        let out = r.dice_payment / 10e8
        let T = r.time.split(' ')
    })
}
/**
 * 判断输赢
 * @param betMask 下注内容
 * @param modulo 游戏类型 2硬币 6骰子 36两个骰子 100Ethroll
 * @param ra 玩家随机数
 * @param rb 庄家随机数
 * @param isPlayer 调用者是否为玩家
 * @returns {Boolean} 返回输赢结果
 */
function winOrLose(betMask, modulo, ra, rb, isPlayer=true){

  let hash = global.web3.utils.soliditySha3(ra, rb);
  let dice = global.web3.utils.toBN(hash).umod(global.web3.utils.toBN(modulo)).toNumber();
  let betMaskNumber = parseInt(betMask);
  let playerWin = false;


  if(parseInt(modulo) < 40){
      if (((2 ** dice) & betMaskNumber) != 0) {
          playerWin = true;
      }
  }else{
      if(dice < betMaskNumber){
          playerWin = true;
      }
  }

  if(isPlayer)
      return playerWin;
  else
      return !playerWin;
}


export default {
  winOrLose
};

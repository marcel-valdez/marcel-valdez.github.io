import{h,Component,render}from"https://unpkg.com/preact@10.3.3?module";import htm from"https://unpkg.com/htm@3.0.3?module";const html=htm.bind(h),Winner=Object.freeze({ATTACKER:"ATTACKER",DEFENDER:"DEFENDER"}),MoveType=Object.freeze({MOVE:"MOVE",ATTACK:"ATTACK",INVALID:"INVALID",SACRIFICE:"SACRIFICE",PROMOTION:"PROMOTION",EN_PASSANT_ATTACK:"EN_PASSANT_ATTACK",PROMOTION_ATTACK:"PROMOTION_ATTACK",CASTLE:"CASTLE"}),Side=Object.freeze({WHITE:"WHITE",BLACK:"BLACK"}),PieceType=Object.freeze({PAWN:"PAWN",KNIGHT:"KNIGHT",ROOK:"ROOK",KING:"KING"}),GameStatus=Object.freeze({WHITE_WON:"WHITE_WON",BLACK_WON:"BLACK_WON",IN_PROGRESS:"IN_PROGRESS"});let DEBUG=!1,INFO=!0,WARNING=!0,ERROR=!0,DISABLE_LOGGING=!1;const enableDebug=()=>{DEBUG=!0},disableDebug=()=>{DEBUG=!1},disableInfo=()=>{INFO=!1,DEBUG=!1},disableWarning=()=>{WARNING=!1,disableInfo()},disableError=()=>{ERROR=!1,disableWarning()},disableLogging=()=>{DISABLE_LOGGING=!0},enableLogging=()=>{DISABLE_LOGGING=!1},log=(...e)=>!DISABLE_LOGGING&&console&&console.log(...e),debug=(...e)=>DEBUG&&log("DEBUG: ",...e),info=(...e)=>INFO&&log("INFO: ",...e),warn=(...e)=>WARNING&&log("WARN: ",...e),error=(...e)=>ERROR&&log("ERROR: ",...e),isNotNullOrUndefined=e=>null!=e,isNullOrUndefined=e=>!isNotNullOrUndefined(e);var utils={disableInfo:disableInfo,disableWarning:disableWarning,disableError:disableError,disableLogging:disableLogging,enableLogging:enableLogging,disableDebug:disableDebug,enableDebug:enableDebug,debug:debug,info:info,warn:warn,error:error,log:log,isNullOrUndefined:isNullOrUndefined,isNotNullOrUndefined:isNotNullOrUndefined};const applyProps=(e,t)=>{e.toJson=()=>t,e.constructor.fromJson=t=>new e.constructor(t),Object.defineProperty(e,"canCastle",{get:()=>void 0!==t.canCastle&&t.canCastle}),Object.defineProperty(e,"x",{get:()=>t.position[0]}),Object.defineProperty(e,"y",{get:()=>t.position[1]}),Object.defineProperty(e,"side",{get:()=>t.side}),Object.defineProperty(e,"power",{get:()=>t.power}),Object.defineProperty(e,"type",{get:()=>t.type}),e.markMoved=()=>e,e.isBasicValidMove=(t,i,s)=>{if(i===e.x&&s===e.y)return utils.warn(`Tried to move ${e.type} into same place.`),!1;if(!t.isWithinBoundaries(i,s))return utils.warn(`Tried to move ${e.type} outside of boundaries.`),!1;if(t.containsPieceAt(i,s)){const n=t.getPieceAt(i,s);if(e.isAlly(n)&&n.type==PieceType.KING)return!1}return!0}},DEFAULT_STATE=Object.freeze({position:[0,0],power:0,side:Side.WHITE});function Knight(e=DEFAULT_STATE){const t=Object.freeze(Object.assign({type:PieceType.KNIGHT},DEFAULT_STATE,e));return applyProps(this,t),this.copy=e=>new Knight(Object.assign({},t,e)),this.isAlly=e=>this.side==e.side,this.computeMoveType=(e,t,i)=>{const s=Math.abs(t-this.x),n=Math.abs(i-this.y);if(t===this.x&&i===this.y)return utils.warn("Tried to move Knight into same place."),MoveType.INVALID;if(!e.isWithinBoundaries(t,i))return utils.warn("Tried to move Knight outside of boundaries."),MoveType.INVALID;if(s>2||n>2)return utils.warn("Tried to move Knight more than two squares away."),MoveType.INVALID;if(1==s&&2==n||1==n&&2==s)return utils.warn("L moves not allowed for Knights."),MoveType.INVALID;if(s<=1&&n<=1)return e.containsPieceAt(t,i)?(utils.warn("Knights cannot attack immediate squares."),MoveType.INVALID):MoveType.MOVE;if(0===s&&!e.containsPieceAt(t,this.y+(i-this.y)/2)||0===n&&!e.containsPieceAt(this.x+(t-this.x)/2,i)||n>1&&s>1&&!e.containsPieceAt(this.x+(t-this.x)/2,this.y+(i-this.y)/2))return utils.warn("Tried skip square with Knight without a piece in between."),MoveType.INVALID;if(e.containsPieceAt(t,i)){const s=e.getPieceAt(t,i);return this.isAlly(s)?s.type===PieceType.KING?(utils.warn("You can't sacrifice the King!"),MoveType.INVALID):MoveType.SACRIFICE:MoveType.ATTACK}return MoveType.MOVE},this}const DEFAULT_STATE$1=Object.freeze({position:[0,0],power:0,side:Side.WHITE,canCastle:!0});function Rook(e=DEFAULT_STATE$1){const t=Object.freeze(Object.assign({type:PieceType.ROOK},DEFAULT_STATE$1,e));return applyProps(this,t),this.copy=e=>new Rook(Object.assign({},t,e)),this.markMoved=()=>this.copy({canCastle:!1}),this.isAlly=e=>this.side==e.side,this.computeMoveType=(e,t,i)=>{if(!this.isBasicValidMove(e,t,i))return MoveType.INVALID;const s=Math.abs(t-this.x),n=Math.abs(i-this.y);if(s>0&&n>0)return utils.warn("Tried to move rook in a non-straight line."),MoveType.INVALID;if(s>1){const s=Math.min(this.x,t),n=Math.max(this.x,t);for(let t=s+1;t<n;t++)if(e.containsPieceAt(t,i))return utils.warn("Rooks can't skip pieces."),MoveType.INVALID}if(n>1){const s=Math.min(this.y,i),n=Math.max(this.y,i);for(let i=s+1;i<n;i++)if(e.containsPieceAt(t,i))return utils.warn("Rooks can't skip pieces."),MoveType.INVALID}if(e.containsPieceAt(t,i)){const s=e.getPieceAt(t,i);return this.isAlly(s)?MoveType.SACRIFICE:MoveType.ATTACK}return MoveType.MOVE},this}const DEFAULT_STATE$2=Object.freeze({position:[0,0],power:0,side:Side.WHITE});function Pawn(e=DEFAULT_STATE$2){const t=Object.freeze(Object.assign({type:PieceType.PAWN},DEFAULT_STATE$2,e));applyProps(this,t),this.copy=e=>new Pawn(Object.assign({},t,e)),this.isAlly=e=>this.side===e.side,this.isFoe=e=>!this.isAlly(e);const i=(e,t,i)=>{if(e.containsPieceAt(t,i)){const s=e.getPieceAt(t,i);return this.isAlly(s)?MoveType.SACRIFICE:0===i&&this.side===Side.WHITE||7===i&&this.side===Side.BLACK?MoveType.PROMOTION_ATTACK:MoveType.ATTACK}{const s=e.enPassant;if(s&&this.isFoe(s)){if(s.x==t&&(this.side==Side.WHITE&&i==s.y-1||this.side==Side.BLACK&&i==s.y+1))return MoveType.EN_PASSANT_ATTACK}return utils.warn("Cannot move in diagonal. Only attack or sacrifice."),MoveType.INVALID}},s=(e,t,i)=>{const s=Math.abs(t-this.x),n=Math.abs(i-this.y);return this.side===Side.WHITE&&i>this.y||this.side===Side.BLACK&&i<this.y?(utils.warn("Illegal move: Tried to move Pawn backwards."),!0):s>0&&0===n?(utils.warn("Illegal move: Tried to move Pawn sideways."),!0):n>2?(utils.warn("Tried to move Pawn more than two squares away."),!0):s>1?(utils.warn("Pawns cannot move more than 1 square in x-axis."),!0):1===s&&n>=2&&(utils.warn("Pawns cannot move in L patterns."),!0)},n=(e,t,i)=>{Math.abs(t-this.x);const s=Math.abs(i-this.y);return 2===s&&(this.side===Side.WHITE&&e.containsPieceAt(t,i+1)||this.side===Side.BLACK&&e.containsPieceAt(t,i-1))?(utils.warn("Pawns cannot skip pieces"),MoveType.INVALID):s>=1?e.containsPieceAt(t,i)?(utils.warn("Pawns cannot attack immediate squares."),MoveType.INVALID):this.side===Side.WHITE&&0===i||this.side===Side.BLACK&&7===i?MoveType.PROMOTION:MoveType.MOVE:(utils.warn(`Illegal pawn move from (${this.x},${this.y}) to (${t},${i}).`),MoveType.INVALID)};return this.computeMoveType=(e,t,o)=>{const r=Math.abs(t-this.x),a=Math.abs(o-this.y);return this.isBasicValidMove(e,t,o)?s(0,t,o)?MoveType.INVALID:1===r&&1===a?i(e,t,o):n(e,t,o):MoveType.INVALID},this}const DEFAULT_STATE$3=Object.freeze({position:[0,0],power:0,side:Side.WHITE,canCastle:!0});function King(e=DEFAULT_STATE$3){const t=Object.freeze(Object.assign({type:PieceType.KING},DEFAULT_STATE$3,e));return applyProps(this,t),this.copy=e=>new King(Object.assign({},t,e)),this.markMoved=()=>this.copy({canCastle:!1}),this.isAlly=e=>this.side==e.side,this.computeMoveType=(e,t,i)=>{if(!this.isBasicValidMove(e,t,i))return MoveType.INVALID;const s=Math.abs(t-this.x),n=Math.abs(i-this.y);if(this.canCastle&&0==n&&s>1){const s=Math.min(this.x,t)+1;if(e.containsPieceAt(s,i))return utils.warn("Kings cannot skip pieces."),MoveType.INVALID;const n=e.getPieceAt(t,i);if(null!=n&&n.type==PieceType.ROOK&&this.isAlly(n)&&n.canCastle)return MoveType.CASTLE}return s>1||n>1?(utils.warn("Tried to move king more than 1 square."),MoveType.INVALID):e.containsPieceAt(t,i)?this.isAlly(e.getPieceAt(t,i))?(utils.warn("Kings cannot sacrifice allies."),MoveType.INVALID):MoveType.ATTACK:MoveType.MOVE},this}const EngineOutcome={NONE:"NONE",ALWAYS_WIN:"ALWAYS_WIN",ALWAYS_LOSE:"ALWAYS_LOSE"},STARTING_BOARD=Object.freeze([[new Rook({position:[0,0],side:Side.BLACK}),new Knight({position:[1,0],side:Side.BLACK}),new King({position:[2,0],side:Side.BLACK}),new Knight({position:[3,0],side:Side.BLACK}),new Rook({position:[4,0],side:Side.BLACK})],[new Pawn({position:[0,1],side:Side.BLACK}),new Pawn({position:[1,1],side:Side.BLACK}),new Pawn({position:[2,1],side:Side.BLACK}),new Pawn({position:[3,1],side:Side.BLACK}),new Pawn({position:[4,1],side:Side.BLACK})],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[new Pawn({position:[0,6],side:Side.WHITE}),new Pawn({position:[1,6],side:Side.WHITE}),new Pawn({position:[2,6],side:Side.WHITE}),new Pawn({position:[3,6],side:Side.WHITE}),new Pawn({position:[4,6],side:Side.WHITE})],[new Rook({position:[0,7],side:Side.WHITE}),new Knight({position:[1,7],side:Side.WHITE}),new King({position:[2,7],side:Side.WHITE}),new Knight({position:[3,7],side:Side.WHITE}),new Rook({position:[4,7],side:Side.WHITE})]]);function attack(e,t,i=EngineOutcome.NONE){let s=null;return s=i===EngineOutcome.ALWAYS_WIN?Winner.ATTACKER:i===EngineOutcome.ALWAYS_LOSE?Winner.DEFENDER:determineWinner(e,t,i),s===Winner.ATTACKER?{result:s,winner:e.copy({power:e.power-1,position:t.position})}:{result:s,winner:t.copy({power:t.power-1})}}function determineWinner(e,t){return realizeOdds(computePieceWinOdds(e,t))?Winner.ATTACKER:Winner.DEFENDER}function computePieceWinOdds(e,t){let i=e.power,s=t.power;return e.type===PieceType.KING&&t.type!==PieceType.KING?s=0:t.type===PieceType.KING&&e.type!==PieceType.KING&&(i=0),computeWinOdds(i,s)}function computeWinOdds(e,t){const i=1/2**(1+Math.abs(e-t));return e>=t?1-i:i}function realizeOdds(e){return Math.random()<e}function computeSacrificePower(e,t){return e<0?e>t?e:e===t?e+1:e+(t-e):t<0?e:e+t+1}function sacrifice(e,t){return e.copy({power:computeSacrificePower(e.power,t.power)})}function setPiece(e,t,i,s){return e.map((e,n)=>n===s?e.map((e,s)=>s===i?null==t?null:t.copy({position:[s,n]}).markMoved():e):e)}function removePiece(e,t,i){return setPiece(e,null,t,i)}function movePiece(e,t,i){const[s,n]=t,[o,r]=i,a=e[n][s];if(null==a)throw`There is no piece to move at (${t})!!`;const d=removePiece(e,s,n),l=a.copy({position:i}),c=setPiece(d,l,o,r);let p=null;return l.type===PieceType.PAWN&&2==Math.abs(n-r)&&(p=l),{squares:c,enPassant:p}}const DEFAULT_BOARD_STATE={squares:STARTING_BOARD,enPassant:null,promotion:null,gameStatus:GameStatus.IN_PROGRESS};function Board(e=DEFAULT_BOARD_STATE){const t=Object.freeze(Object.assign({},DEFAULT_BOARD_STATE,e));Object.defineProperty(this,"enPassant",{get:()=>t.enPassant}),Object.defineProperty(this,"pendingPromotion",{get:()=>null!==t.promotion}),Object.defineProperty(this,"gameStatus",{get:()=>t.gameStatus}),this.copy=(e=null)=>{if(null===e)return this;return new Board(Object.assign({},t,e))},this.toJson=()=>({squares:this.getRows().map(e=>e.map(e=>null===e?null:e.toJson())),enPassant:t.enPassant?t.enPassant.toJson():null,promotion:t.promotion?t.promotion.toJson():null,gameStatus:t.gameStatus});const i=(e,i)=>{const{squares:s,enPassant:n}=movePiece(t.squares,e,i);return this.copy({squares:s,enPassant:n})},s=(e,t,i)=>{let s=this.gameStatus;return e.result===Winner.ATTACKER&&i.type===PieceType.KING&&(s=e.winner.side===Side.WHITE?GameStatus.WHITE_WON:GameStatus.BLACK_WON),e.result===Winner.DEFENDER&&t.type===PieceType.KING&&(s=e.winner.side===Side.BLACK?GameStatus.BLACK_WON:GameStatus.WHITE_WON),s},n=(e,i,n=EngineOutcome)=>{const[o,r]=e,[a,d]=i,l=this.getPieceAt(o,r),c=this.getPieceAt(a,d),p=attack(l,c,n);return this.copy({squares:removePiece(setPiece(t.squares,p.winner,a,d),o,r),enPassant:null,gameStatus:s(p,l,c)})},o=(e,i)=>{const[s,n]=e,[o,r]=i,a=this.getPieceAt(s,n),d=this.getPieceAt(o,r);if(d.type===PieceType.KING)return this;const l=sacrifice(a,d);return this.copy({squares:removePiece(setPiece(t.squares,l,o,r),s,n),enPassant:null})},r=(e,i,s=EngineOutcome.NONE)=>{const[n,o]=e,[r,a]=i,d=this.getPieceAt(n,o),{result:l,winner:c}=attack(d,this.enPassant);let p=null;return p=l===Winner.ATTACKER?setPiece(removePiece(removePiece(t.squares,this.enPassant.x,this.enPassant.y),n,o),c,r,a):setPiece(removePiece(t.squares,n,o),c,this.enPassant.x,this.enPassant.y),this.copy({squares:p,enPassant:null})},a=(e,t)=>{const[s,n]=t,o=i(e,t);return o.copy({promotion:o.getPieceAt(s,n)})},d=(e,t,i=EngineOutcome.NONE)=>{const[o,r]=t,d=n(e,t,i),l=d.getPieceAt(o,r),c=this.getPieceAt(o,r);return l.type===PieceType.PAWN?a(e,t).copy({gameStatus:s({result:Winner.ATTACKER,winner:l},l,c)}):d},l=(e,i)=>{const[s]=e,[n,o]=i,{squares:r}=t,a=this.getPieceAt(n,o),d=Math.min(s,n)+1,{squares:l,enPassant:c}=movePiece(r,e,i),p=setPiece(l,a,d,o);return this.copy({squares:p,enPassant:c})};return this.makeMove=(e,t,s=EngineOutcome.NONE)=>{const[c,p]=e,[u,h]=t;if(c===u&&p===h)throw`Source (${e}) and destination (${t}) for a move can't be the same.`;const T=this.getPieceAt(c,p);if(null==T)return utils.warn(`There is no piece to move at (${e}).`),this;const A=T.computeMoveType(this,u,h);switch(A){case MoveType.INVALID:return utils.info(`Invalid move from (${e}) to (${t})`),this;case MoveType.ATTACK:return n(e,t,s);case MoveType.MOVE:return i(e,t);case MoveType.SACRIFICE:return o(e,t);case MoveType.EN_PASSANT_ATTACK:return r(e,t,s);case MoveType.PROMOTION:return a(e,t);case MoveType.PROMOTION_ATTACK:return d(e,t,s);case MoveType.CASTLE:return l(e,t);default:throw`${A} is not supported.`}},this.setPromotion=(e=PieceType.ROOK)=>{const[i,s]=[t.promotion.x,t.promotion.y],n=t.promotion.side;let o;o=e===PieceType.ROOK?new Rook({side:n,position:[i,s],power:0}):new Knight({side:n,position:[i,s],power:0});const r=setPiece(t.squares,o,i,s);return this.copy({squares:r,promotion:null})},this.getRow=e=>{if(e<0||e>t.squares.length)throw`Row indices can only be values 0-7. Got: ${e}.`;return Object.freeze(t.squares[e])},this.getRows=()=>Object.freeze(t.squares),this.getPieceAt=(e,i)=>t.squares[i][e],this.containsPieceAt=(e,t)=>null!==this.getPieceAt(e,t),this.isWithinBoundaries=(e,i)=>e>=0&&i>=0&&t.squares.length>i&&t.squares[0].length>e,this}const fromJsonCell=e=>{if(null===e)return null;switch(e.type){case PieceType.PAWN:return Pawn.fromJson(e);case PieceType.KNIGHT:return Knight.fromJson(e);case PieceType.ROOK:return Rook.fromJson(e);case PieceType.KING:return King.fromJson(e);default:throw Error(`Unknown piece type: ${e.type}`)}};Board.fromJson=({squares:e,enPassant:t,promotion:i,gameStatus:s})=>new Board({squares:e.map(e=>e.map(e=>fromJsonCell(e))),enPassant:fromJsonCell(t),promotion:fromJsonCell(i),gameStatus:s});class CellUi extends Component{getHtmlClassForSide(e=Side.WHITE){return e===Side.WHITE?"white-piece":"black-piece"}getHtmlClassForPosition(e=0,t=0){return e%2==0?t%2==0?"white-square":"black-square":t%2==0?"black-square":"white-square"}getHtmlClassForPieceType(e=PieceType.KNIGHT){switch(e){case PieceType.KNIGHT:return"knight";case PieceType.PAWN:return"pawn";case PieceType.ROOK:return"rook";case PieceType.KING:return"king";default:throw`Piece type ${e} unknown.`}}getHtmlClassForPiece(e=null){return null===e?"empty":this.getHtmlClassForSide(e.side)+" "+this.getHtmlClassForPieceType(e.type)}getHtmlClassForTurn(e=!1,t=!1){return e?"src-piece":t?"dst-piece":""}getHtmlContentForPiece(e=null){if(null===e)return"";let t="";switch(e.type){case PieceType.KNIGHT:t+=e.side==Side.WHITE?"♘":"♞";break;case PieceType.PAWN:t+=e.side==Side.WHITE?"♙":"♟";break;case PieceType.ROOK:t+=e.side==Side.WHITE?"♖":"♜";break;case PieceType.KING:t+=e.side==Side.WHITE?"♔":"♚";break;default:throw`Piece type ${e.type} unknown.`}if(0!==e.power){let i,s="piece-power";return e.power<0?(i=`${e.power}`,s+=" weak"):(i=`+${e.power}`,s+=" strong"),html`${t}
<div class="piece-power-container">
  <div class="${s}">${i}</div>
</div>`}return html`${t}`}getHtmlClassForMoveValidity(e=!1){return e?"valid-move":""}getHtmlClassForSelection(e=!1){return e?"selected-piece":""}getTooltipHtmlContent(e=0){return e<=0?"":html`
<div class="battletooltip-container">
<div class="battletooltip">
${100*e}% odds of defeating this piece.
</div>
</div>`}render({piece:e=null,x:t=0,y:i=0,onClick:s=((e=[])=>{}),isSrcPiece:n=!1,isDstPiece:o=!1,isSelected:r=!1,isValidMovePosition:a=!1,oddsForPiece:d=0},{}){const l=this.getHtmlContentForPiece(e),c=this.getTooltipHtmlContent(d);let p="square "+this.getHtmlClassForTurn(n,o)+" "+this.getHtmlClassForSelection(r)+" "+this.getHtmlClassForPosition(t,i)+" "+this.getHtmlClassForPiece(e)+" "+this.getHtmlClassForMoveValidity(a);return html`<td
      class=${p}
      onClick=${()=>s()}>
        ${l}
        ${c}
    </td>`}}class RowUi extends Component{render({y:e=0,row:t=[],selectedPos:i=[],markedSrc:s=[],markedDst:n=[],onClickPiece:o=((e=[])=>{}),isValidMovePositionFn:r=((e,t)=>!1),oddsForPieceFn:a=((e,t)=>0)},{}){const[d=-1,l=-1]=i||[],[c=-1,p=-1]=s||[],[u=-1,h=-1]=n||[],T=t.map((t=null,i=0)=>html`<${CellUi}
    x=${i}
    y=${e}
    piece=${t}
    isSelected=${i===d&&e===l}
    isSrcPiece=${i===c&&e===p}
    isDstPiece=${i===u&&e===h}
    onClick=${()=>o([i,e])}
    isValidMovePosition=${r(i,e)}
    oddsForPiece=${a(i,e)}
      />`);return html`<tr class='power-row'>${T}</tr>`}}class PromoCellUi extends Component{getCellHtmlContent(e,t){switch(e){case PieceType.KNIGHT:return t==Side.WHITE?"♘":"♞";case PieceType.ROOK:return t==Side.WHITE?"♖":"♜";default:throw"Piece type ${piece.type} is not a valid promotion type."}}render({onClick:e=(()=>{}),type:t=PieceType.ROOK,side:i=Side.WHITE},{}){const s=this.getCellHtmlContent(t,i);return html`<td class='square' onClick=${()=>e()}>${s}</td>`}}class PromotionUi extends Component{render({onClick:e=((e=PieceType.ROOK)=>{}),side:t=Side.WHITE},{}){return html`<table class='power-table modal'>
<tr class='power-row'>
<${PromoCellUi}
  side=${t}
  type=${PieceType.KNIGHT}
  onClick=${()=>e(PieceType.KNIGHT)} />
<${PromoCellUi}
  side=${t}
  type=${PieceType.ROOK}
  onClick=${()=>e(PieceType.ROOK)} />
</tr>
</table>`}}class ResetButton extends Component{render({onClick:e=(()=>{})},{}){return html`
<button
  class='btn'
  type='button'
  title='Reset the board to initial state.'
  onClick=${e}>
RESET
</button>`}}class UndoButton extends Component{render({onClick:e=(()=>{})},{}){return html`<button title="Undo last action" class='btn' type='button' onClick=${e}>
⤺
</button>`}}class GameEndedModal extends Component{render({gameStatus:e=GameStatus.WHITE_WON},{}){let t="";if(e===GameStatus.WHITE_WON)t="♔ White won!";else{if(e!==GameStatus.BLACK_WON)throw`Invalid game status for modal: ${e}`;t="♚ Black Won!"}return html`<div class='modal game-result'>${t}</div>`}}class EngineThinkingModal extends Component{render({},{}){return html`<div class='modal thinking'>
Mmmhhh... let me think<br/>
<img src="ui/thinking.gif" width="40" height="40"></img>
</div>`}}class HelpButton extends Component{render({onClick:e=(()=>{})},{}){return html`
<button
  class='btn'
  type='button'
  title='Show help'
  onClick=${e}>?</button>`}}class HelpModal extends Component{render({onClick:e=(()=>{})},{}){return html`
<div class="modal help-modal" onClick=${e}>
  <div class="piece-moves">
    <div class="piece-moves-title">
      <b>Notation</b>
    </div>
    <ul>
      <li><b>M</b>: Piece can move to this square.
        <ul>
          <li>No piece, other than the Knight (♘) can skip pieces.</li>
        </ul>
      </li>
      <li><b>A</b>: Piece can attack or sacrifice on this square.
        <ul>
          <li id="knight-attack">
            <b>♘</b>: It can only attack the marked square <tag class="knight-skip">(MA)</tag> if there is a piece in between to skip.
          </li>
          <li>
            <b>♔</b>: It can't sacrifice.
          </li>
        </ul>
      </li>
    </ul>
  </div>

  <table class="all-pieces-moves">
    <tbody>
      <tr>
        <td>
          <div class="piece-moves">
            <div class="piece-moves-title">King (♔)</div>
            <table class="moves-table">
              <tbody>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td>MA</td>
                  <td>MA</td>
                  <td>MA</td>
                  <td></td>
                </tr>

                <tr>
                  <td></td>
                  <td>MA</td>
                  <td>♔</td>
                  <td>MA</td>
                  <td></td>
                </tr>

                <tr>
                  <td></td>
                  <td>MA</td>
                  <td>MA</td>
                  <td>MA</td>
                  <td></td>
                </tr>

                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
            </tbody>
          </table>
        </div>
      </td>
      <td>
        <div class="piece-moves">
          <div class="piece-moves-title">Pawn (♙)</div>
          <table class="moves-table">
            <tbody>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>

              <tr>
                <td></td>
                <td></td>
                <td>M</td>
                <td></td>
                <td></td>
              </tr>

              <tr>
                <td></td>
                <td>A</td>
                <td>M</td>
                <td>A</td>
                <td></td>
              </tr>

              <tr>
                <td></td>
                <td></td>
                <td>♙</td>
                <td></td>
                <td></td>
              </tr>

              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </td>
    </tr>
    <tr>
      <td>
        <div class="piece-moves">
          <div class="piece-moves-title">Knight (♘)</div>
          <table class="moves-table">
            <tbody>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>

              <tr>
                <td class="knight-skip" title="Only legal if there is a piece to skip.">MA</td>
                <td></td>
                <td class="knight-skip" title="Only legal if there is a piece to skip.">MA</td>
                <td></td>
                <td class="knight-skip" title="Only legal if there is a piece to skip.">MA</td>
              </tr>

              <tr>
                <td> </td>
                <td>M</td>
                <td>M</td>
                <td>M</td>
                <td> </td>
              </tr>

              <tr>
                <td class="knight-skip" title="Only legal if there is a piece to skip.">MA</td>
                <td>M</td>
                <td>♘</td>
                <td>M</td>
                <td class="knight-skip" title="Only legal if there is a piece to skip.">MA</td>
              </tr>

              <tr>
                <td></td>
                <td>M</td>
                <td>M</td>
                <td>M</td>
                <td></td>
              </tr>

              <tr>
                <td class="knight-skip" title="Only legal if there is a piece to skip.">MA</td>
                <td></td>
                <td class="knight-skip" title="Only legal if there is a piece to skip.">MA</td>
                <td></td>
                <td class="knight-skip" title="Only legal if there is a piece to skip.">MA</td>
              </tr>

              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </td>
    <td>
      <div class="piece-moves">
        <div class="piece-moves-title">Rook (♖)</div>
          <table class="moves-table">
            <tbody>
              <tr>
                <td></td>
                <td></td>
                <td>MA</td>
                <td></td>
                <td></td>
              </tr>

              <tr>
                <td></td>
                <td></td>
                <td>MA</td>
                <td></td>
                <td></td>
              </tr>

              <tr>
                <td></td>
                <td></td>
                <td>MA</td>
                <td></td>
                <td></td>
              </tr>

              <tr>
                <td></td>
                <td></td>
                <td>MA</td>
                <td></td>
                <td></td>
              </tr>

              <tr>
                <td>MA</td>
                <td>MA</td>
                <td>♖</td>
                <td>MA</td>
                <td>MA</td>
              </tr>

              <tr>
                <td></td>
                <td></td>
                <td>MA</td>
                <td></td>
                <td></td>
              </tr>

              <tr>
                <td></td>
                <td></td>
                <td>MA</td>
                <td></td>
                <td></td>
              </tr>

              <tr>
                <td></td>
                <td></td>
                <td>MA</td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </td>
    </tr>
    </tbody>
  </table>
</div>
`}}const DEFAULT_STATE$4=Object.freeze({board:new Board,selectedPos:null,src:null,dst:null,side:Side.WHITE,engineMoveId:0,showHelp:!1}),ENGINE_SIDE=Side.BLACK,HUMAN_SIDE=Side.WHITE,engineWorker=new Worker("ai/engineWorker.mjs",{type:"module"});class BoardUi extends Component{constructor(){super(),this.state=Object.assign({},DEFAULT_STATE$4),this.stateStack=[DEFAULT_STATE$4]}updateState(e){this.setState(Object.assign({},this.state,e))}resetState(){this.stateStack=[DEFAULT_STATE$4],this.updateState(DEFAULT_STATE$4)}pushState(e){const t=Math.floor(e.engineMoveId+1e3+1e4*Math.random());this.stateStack.push(Object.assign({},e,{engineMoveId:t}))}popState(){if(1===this.stateStack.length)return void utils.log("No more moves to undo.");let e=this.stateStack.pop();e.board.gameStatus!==GameStatus.IN_PROGRESS||e.board.pendingPromotion||e.side!==ENGINE_SIDE||(e=this.stateStack.pop()),this.setState(e)}getNextSide(){const{side:e}=this.state;return e===Side.WHITE?Side.BLACK:Side.WHITE}clickPiece(e=[]){const{selectedPos:t=null,board:i,side:s}=this.state;i.pendingPromotion||s!==ENGINE_SIDE&&(null===t?this.markSelectedPiece(e):this.movePiece(e))}markSelectedPiece(e=[]){const[t,i]=e,{board:s,side:n}=this.state;if(s.containsPieceAt(t,i)){s.getPieceAt(t,i).side===n&&this.updateState({selectedPos:e})}}genEngineMoveHandler(e,t,i){const s=({data:n})=>{if(e===n.engineMoveId){if(n.engineMoveId!==this.state.engineMoveId){const e=`Ignored AI's move with id: ${n.engineMoveId}, `+`because we expected id: ${this.state.engineMoveId}`;t(e)}else i(n);engineWorker.removeEventListener("message",s)}};return s}genAiMoveBoard({src:e,dst:t}){const i=this.state.board.makeMove(e,t);return i.pendingPromotion?i.setPromotion(PieceType.ROOK):i}pushAiState(e,{src:t,dst:i}){this.pushState(this.state),this.updateState({board:e,selectedPos:null,src:t,dst:i,side:HUMAN_SIDE,engineMoveId:this.state.engineMoveId+1})}engineMove(e,t){new Promise((t,i)=>{const s=this.state.engineMoveId;engineWorker.postMessage({board:e.toJson(),side:ENGINE_SIDE,engineMoveId:s}),engineWorker.addEventListener("message",this.genEngineMoveHandler(s,i,t))}).then(e=>this.pushAiState(this.genAiMoveBoard(e),e)).catch(console.log)}movePiece(e=[]){const{board:t,selectedPos:i=null,src:s=null,side:n}=this.state;if(e[0]===i[0]&&e[1]===i[1])return void this.updateState({selectedPos:null});const o=t.makeMove(i,e);if(o===t)return;const r={board:o,selectedPos:null,src:i,dst:e,side:this.getNextSide()};this.pushState(Object.assign({},this.state,{selectedPos:null})),this.updateState(r),o.gameStatus!==GameStatus.IN_PROGRESS||o.pendingPromotion||this.engineMove(o)}setPromotion(e=PieceType.ROOK){const{board:t}=this.state,i=t.setPromotion(e);this.updateState({board:i}),this.engineMove(i)}toggleHelpMessage(){const{showHelp:e}=this.state,t=!e;this.updateState({showHelp:t})}render({},{board:e,selectedPos:t=[],src:i=[],dst:s=[],side:n=Side.WHITE}){const o=(i,s)=>{if(null===t)return!1;const[n,o]=t,r=e.getPieceAt(n,o);return MoveType.INVALID!==r.computeMoveType(e,i,s)},r=(i,s)=>{if(null===t)return 0;if(!o(i,s))return 0;if(!e.containsPieceAt(i,s))return 0;const[n,r]=t,a=e.getPieceAt(n,r),d=e.getPieceAt(i,s);return a.isAlly(d)?0:computePieceWinOdds(a,d)},a=e.getRows().map((e=[],n=0)=>html`
<${RowUi} y=${n}
          row=${e}
          onClickPiece=${(e=[])=>this.clickPiece(e)}
          isValidMovePositionFn=${o}
          oddsForPieceFn=${r}
          selectedPos=${t}
          markedSrc=${i}
          markedDst=${s} />`);let d=html`
<div class='board-container'>
  <table class='power-table'>${a}</table>
</div>
<div class='btn-container'>
  <${ResetButton} onClick=${()=>this.resetState()} />
  <${UndoButton} onClick=${()=>this.popState()} />
  <${HelpButton} onClick=${()=>this.toggleHelpMessage()} />
</div>`;return!0===this.state.showHelp?d=html`
${d}
<${HelpModal} onClick${()=>this.toggleHelpMessage()}/>
`:e.gameStatus!==GameStatus.IN_PROGRESS?d=html`${d}
<${GameEndedModal} gameStatus=${e.gameStatus} />`:e.pendingPromotion?d=html`
${d}
<${PromotionUi}
  side=${this.getNextSide()}
  onClick=${e=>this.setPromotion(e)}
/>`:n===ENGINE_SIDE&&(d=html`
${d}
<${EngineThinkingModal} />
`),d}}utils.disableLogging();const app=html`<${BoardUi} />`;render(app,document.getElementById("power"));
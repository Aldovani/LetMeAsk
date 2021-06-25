import copyImg from '../assets/img/copy.svg'
import "../styles/roomcode.scss"

type roomCodeProps = {
  code:string
}


export function RoomCode(props:roomCodeProps) {
  
  function copyRoomCodeToClipboard() {
  navigator.clipboard.writeText(props.code)
}


  return (
    <button className="room-code" onClick={copyRoomCodeToClipboard}>
      <div>
        <img src={copyImg} alt="copy room code " />
      </div>
      <span>sala #{props.code}</span>
    </button>
  )
}
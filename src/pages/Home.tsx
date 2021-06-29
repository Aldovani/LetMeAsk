import { FormEvent, useState } from "react";
import { useHistory } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/Button";

import { database } from "../services/firebase";

import illustration from "../assets/img/illustration.svg";
import logoImg from "../assets/img/logo.svg";
import googleIcon from "../assets/img/google-icon.svg";
import { useTheme } from "../hooks/useTheme";
import { Toggle } from "../components/Toggle";

import "../styles/auth.scss";
export function Home() {
  const history = useHistory();
  const { user, signInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState("");

  const { theme } = useTheme();

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }
    history.push("/rooms/new");
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();
    if (roomCode.trim() === "") return;

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      alert("Room does  not exists");
      return;
    }
    if (roomRef.val().endedAt) {
      alert("Room already closed");
      return;
    }

    history.push(`rooms/${roomCode}`);
  }

  return (
    <div id="page-auth" className={theme}>
      <aside>
        <img
          src={illustration}
          alt="Ilustração simbolizando perguntas e respostas "
        />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvida da sua audiência em tempo-real </p>
      </aside>
      <main>
        <div className="main-content">
      <Toggle />
          <img src={logoImg} alt="LetMeAsk" />
          <button onClick={handleCreateRoom} className="create-room">
            <img src={googleIcon} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">Entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={(event) => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}

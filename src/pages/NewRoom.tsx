import { useState, FormEvent } from "react";
import { Link, useHistory } from "react-router-dom";

import { database } from "../services/firebase";
import { useAuth } from "../hooks/useAuth";

import illustration from "../assets/img/illustration.svg";
import logoImg from "../assets/img/logo.svg";

import { Button } from "../components/Button";
import { Toggle } from "../components/Toggle";

import "../styles/auth.scss";
import { useTheme } from "../hooks/useTheme";

export function NewRoom() {
  const { user } = useAuth();
  const [newRoom, setNewRoom] = useState("");
  const history = useHistory();
  const {theme} = useTheme()
  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    if (newRoom.trim() === "") return;

    const roomRef = database.ref("rooms");
    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    });
    history.push(`/admin/rooms/${firebaseRoom.key}`);
  }

  return (
    <div id="page-auth" className={theme}>
      <Toggle/>
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
          <img src={logoImg} alt="LetMeAsk" />
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Nome da sala"
              onChange={(event) => setNewRoom(event.target.value)}
              value={newRoom}
            />
            <Button type="submit">Criar sala</Button>
          </form>
          <p>
            Quer entra em uma sala existente ?<Link to="/">Clique aqui </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

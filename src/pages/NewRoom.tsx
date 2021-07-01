import Modal from 'react-modal'
import { useState, FormEvent } from "react";
import { Link, useHistory } from "react-router-dom";

import { database } from "../services/firebase";
import { useAuth } from "../hooks/useAuth";

import illustration from "../assets/img/illustration.svg";
import logoImg from "../assets/img/logo.svg";

import { Button } from "../components/Button";
import { Toggle } from "../components/Toggle";

import "../styles/auth.scss"; 
import "../styles/modal.scss";
import { useTheme } from "../hooks/useTheme";

export function NewRoom() {
  const { user,SingOut } = useAuth();
  const [newRoom, setNewRoom] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const history = useHistory();
  const { theme } = useTheme();
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
      <aside>
        <img
          src={illustration}
          alt="Ilustração simbolizando perguntas e respostas "
        />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvida da sua audiência em tempo-real </p>
      </aside>
      <main>
        <div className="topBar-info">
        {user &&
          <div>
            <span>{user?.name}</span>
            <button onClick={()=>setModalOpen(true)}>
          <img src={user?.avatar} alt={user?.name} />
            </button>
            
          </div>
        
        }
          <Toggle />
        </div>
        <div className="main-content">
          <img src={logoImg} className="logo" alt="LetMeAsk" />
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
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => {
          setModalOpen(false);
        }}
        className="Modal"
        overlayClassName="Overlay"
      >
        <div>
          <h1>{user?.name }</h1>
          <img src={user?.avatar} alt={user?.name} />
          <p>Deseja sair dessa conta ?</p>
          <div className="containerButton">
            <button className="button red" onClick={() => setModalOpen(false)}>
              cancelar
            </button>
            <button
              className="button"
              onClick={() => {
                SingOut();
                setModalOpen(false);
                history.push('/')
              }}
            >
              Sair
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

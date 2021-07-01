import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Modal from "react-modal";

import { database } from "../services/firebase";

import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { Question } from "../components/Question";

import { useRoom } from "../hooks/useRoom";
import { useAuth } from "../hooks/useAuth";

import logoImg from "../assets/img/logo.svg";
import deleteImg from "../assets/img/delete.svg";
import endRoom from "../assets/img/endRoom.svg";
import checkImg from "../assets/img/check.svg";
import questionsEmpty from "../assets/img/empty-questions.svg";
import answerImg from "../assets/img/answer.svg";

import "../styles/room.scss";
import "../styles/modal.scss";
import { useTheme } from "../hooks/useTheme";
import {Toggle} from '../components/Toggle'
type roomParams = {
  id: string;
};

export function AdminRoom() {
  const history = useHistory();
  const params = useParams<roomParams>();
  const roomId = params.id;

  const { user } = useAuth();
  const { title, questions } = useRoom(roomId);
  const [questionId, setQuestionId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
const {theme} = useTheme()
  
  useEffect(() => {

    async function getDados() {
      if (!user) {
        return;
      }
   
      const response = await database.ref(`rooms/${roomId}`).get();

      if (!response.exists()) {
        history.push(`/`);

        return;
      }

      if (user?.id !== response.val().authorId) {
        history.push(`/rooms/${roomId}`);
        return;
      }
        setLoading(false);
    }

    getDados();
  }, [history, roomId, user]);

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });

    history.push("/");
  }

  async function handleDeleteQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    setIsModalOpen(false);
  }

  async function handleCheckQuestionAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }
  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="load"></div>
      </div>
    );
  }

  return (
    <div id="page-room" className={theme}>
      <header>
        <div className="content">
          <img src={logoImg} className="logo" alt="LetMeAsk" />
          <div>
            <RoomCode code={roomId} />
            <Button
              onClick={() => {
                setIsModalOpen(true);
              }}
              isOutlined
              >
              Encerrar sala
            </Button>
            
              <Toggle/>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s) </span>}
        </div>

        <div className="question-list">
          {questions.length === 0 && (
            <div className="questionsEmpty">
              <img src={questionsEmpty} alt="" />
              <h3>Nenhuma pergunta por aqui...</h3>
              <p>
                Envie o código desta sala para seus amigos e comece a responder
                perguntas!
              </p>
            </div>
          )}
          {questions.sort(function (a, b) {
              return b.likeCount-a.likeCount
            }).map((question) => (
            <Question
              key={question.id}
              content={question.content}
              author={question.author}
              isAnswered={question.isAnswered}
              isHighlighted={question.isHighlighted}
            >
              {!question.isAnswered && (
                  <>
                    {question.likeCount}
                  <button
                    type="button"
                    onClick={() => {
                      handleCheckQuestionAnswered(question.id);
                    }}
                  >
                    <img
                      src={checkImg}
                      alt="Marcar a pergunta como respondida"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleHighlightQuestion(question.id);
                    }}
                  >
                    <img src={answerImg} alt="Destacar à pergunta" />
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(true);
                  setQuestionId(question.id);
                }}
              >
                <img src={deleteImg} alt="Remover pergunta" />
              </button>
            </Question>
          ))}
        </div>
      </main>
      <Modal
        onRequestClose={() => {
          setIsModalOpen(false);
          setQuestionId("");
        }}
        className="Modal"
        isOpen={isModalOpen}
        overlayClassName="Overlay"
      >
        {questionId === "" ? (
          <div>
            <img src={endRoom} alt="Fechar sala" />
            <h3>Encerrar sala</h3>
            <p>Tem certeza que você deseja encerrar esta sala?</p>
            <div className="containerButton">
              <button
                className="button default"
                onClick={() => {
                  setIsModalOpen(false);
                }}
              >
                Cancelar{" "}
              </button>
              <button className="button red" onClick={handleEndRoom}>
                Sim, encerrar
              </button>
            </div>
          </div>
        ) : (
          <div>
            <img src={deleteImg} className="delete" alt="Delete Icon" />

            <h3>Excluir pergunta</h3>
            <p>Tem certeza que você deseja excluir esta pergunta?</p>

            <div className="containerButton">
              <button
                className="button default"
                onClick={() => {
                  setIsModalOpen(false);
                  setQuestionId("");
                }}
              >
                Cancelar
              </button>

              <button
                className="button red"
                onClick={() => {
                  setIsModalOpen(false);
                  handleDeleteQuestion(questionId);
                  setQuestionId("");
                }}
              >
                {" "}
                Sim, excluir
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

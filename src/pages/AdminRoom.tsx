import { useHistory, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";

import { Question } from "../components/Question";
import { useRoom } from "../hooks/useRoom";

import logoImg from "../assets/img/logo.svg";
import deleteImg from "../assets/img/delete.svg";
import checkImg from "../assets/img/check.svg";
import answerImg from "../assets/img/answer.svg";
import "../styles/room.scss";
import { database } from "../services/firebase";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

type roomParams = {
  id: string;
};

export function AdminRoom() {
  const history = useHistory();
  const params = useParams<roomParams>();
  const roomId = params.id;

  const { user } = useAuth();
  const { title, questions } = useRoom(roomId);

  useEffect(() => {
    async function getDados() {
      const response = await database.ref(`rooms/${roomId}`).get()
    
      if (user?.id !== response.val().authorId) {
        history.push(`/rooms/${roomId}`);
      }
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
    if (window.confirm("Tem certeza que deseja excluir essa pergunta ? ")) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
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

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="LetMeAsk" />
          <div>
            <RoomCode code={roomId} />
            <Button onClick={handleEndRoom} isOutlined>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s) </span>}
        </div>

        <div className="question-list">
          {questions.map((question) => (
            <Question
              key={question.id}
              content={question.content}
              author={question.author}
              isAnswered={question.isAnswered}
              isHighlighted={question.isHighlighted}
            >
              {!question.isAnswered && (
                <>
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
                  handleDeleteQuestion(question.id);
                }}
              >
                <img src={deleteImg} alt="Remover pergunta" />
              </button>
            </Question>
          ))}
        </div>
      </main>
    </div>
  );
}
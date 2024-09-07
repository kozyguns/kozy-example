"use client";
import React, {
  useState,
  Dispatch,
  SetStateAction,
  DragEvent,
  FormEvent,
  useEffect,
  useRef,
} from "react";
import { PlusIcon, TrashIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import { supabase } from "@/utils/supabase/client";
import { useRole } from "@/context/RoleContext"; // Adjust the import path if needed
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ColumnType = {
  id: string;
  title: string;
};

type CardType = {
  id: string;
  title: string;
  column_name: string;
  created_by: string; // Assuming you have a field that stores the creator's ID
};

const CustomKanban = () => {
  return (
    <div className="h-screen w-full">
      <Board />
    </div>
  );
};

export default function Board() {
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [cards, setCards] = useState<CardType[]>([]);
  const channel = useRef(null);
  const { role, user } = useRole(); // Get the role and user from context

  const fetchColumns = async () => {
    const { data, error } = await supabase
      .from("weekly_agenda_columns")
      .select("*");
    if (error) {
      console.error("Error fetching columns:", error);
    } else {
      setColumns(data);
    }
  };

  const fetchCards = async () => {
    const { data, error } = await supabase.from("weekly_agenda").select("*");
    if (error) {
      console.error("Error fetching cards:", error);
    } else {
      setCards(data);
    }
  };

  useEffect(() => {
    fetchColumns();
    fetchCards();

    const WeeklyAgendaSubscription = supabase
      .channel("custom-weekly-agenda-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "weekly_agenda" },
        (payload) => {
          fetchCards();
        }
      )
      .subscribe();

    const WeeklyAgendaColumnsSubscription = supabase
      .channel("custom-weekly-agenda-columns-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "weekly_agenda_columns" },
        (payload) => {
          fetchColumns();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(WeeklyAgendaSubscription);
      supabase.removeChannel(WeeklyAgendaColumnsSubscription);
    };
  }, []);

  const addCard = async (column_name: string, title: string) => {
    const { data, error } = await supabase
      .from("weekly_agenda")
      .insert([{ column_name, title, created_by: user.email }]) // Include created_by field
      .select();
    if (error) {
      console.error("Error adding card:", error);
    } else {
      setCards((prevCards) => [...prevCards, data[0]]);
    }
  };

  const updateCardColumn = async (id: string, column_name: string) => {
    const { error } = await supabase
      .from("weekly_agenda")
      .update({ column_name })
      .eq("id", id);
    if (error) {
      console.error("Error updating card column:", error);
    } else {
      fetchCards();
    }
  };

  const updateCardTitle = async (id: string, title: string) => {
    const { error } = await supabase
      .from("weekly_agenda")
      .update({ title })
      .eq("id", id);
    if (error) {
      console.error("Error updating card title:", error);
    } else {
      fetchCards();
    }
  };

  const deleteCard = async (id: string, createdBy: string) => {
    if (
      role === "super admin" ||
      (role === "admin" && user.email === createdBy)
    ) {
      const { error } = await supabase
        .from("weekly_agenda")
        .delete()
        .eq("id", id);
      if (error) {
        console.error("Error deleting card:", error);
      } else {
        setCards((prevCards) => prevCards.filter((card) => card.id !== id));
      }
    } else {
      console.error("You do not have permission to delete this card.");
    }
  };

  const addColumn = async (title: string) => {
    if (role === "super admin") {
      const { data, error } = await supabase
        .from("weekly_agenda_columns")
        .insert([{ title }])
        .select();
      if (error) {
        console.error("Error adding column:", error);
      } else {
        setColumns((prevColumns) => [...prevColumns, data[0]]);
      }
    } else {
      console.error("You do not have permission to add columns.");
    }
  };

  const updateColumnTitle = async (id: string, title: string) => {
    const { error } = await supabase
      .from("weekly_agenda_columns")
      .update({ title })
      .eq("id", id);
    if (error) {
      console.error("Error updating column title:", error);
    } else {
      fetchColumns();
    }
  };

  const deleteColumn = async (id: string) => {
    if (role === "super admin") {
      const { error } = await supabase
        .from("weekly_agenda_columns")
        .delete()
        .eq("id", id);
      if (error) {
        console.error("Error deleting column:", error);
      } else {
        setColumns((prevColumns) =>
          prevColumns.filter((column) => column.id !== id)
        );
      }
    } else {
      console.error("You do not have permission to delete this column.");
    }
  };

  return (
    <Card className="h-full mt-4">
      <CardHeader>
        <CardTitle>Weekly Agenda</CardTitle>
        {role === "super admin" && <AddColumn handleAddColumn={addColumn} />}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {columns.map((column) => (
            <Column
              key={column.id}
              title={column.title}
              column={column}
              headingColor="text-black dark:text-white"
              cards={cards.filter((card) => card.column_name === column.title)}
              setCards={setCards}
              updateCardColumn={updateCardColumn}
              updateCardTitle={updateCardTitle}
              addCard={addCard}
              deleteCard={deleteCard}
              updateColumnTitle={updateColumnTitle}
              deleteColumn={deleteColumn}
            />
          ))}
        </div>
        <BurnBarrel setCards={setCards} />
      </CardContent>
    </Card>
  );
}

type ColumnProps = {
  title: string;
  headingColor: string;
  cards: CardType[];
  column: ColumnType;
  setCards: Dispatch<SetStateAction<CardType[]>>;
  updateCardColumn: (id: string, column_name: string) => void;
  updateCardTitle: (id: string, title: string) => void;
  addCard: (column_name: string, title: string) => void;
  deleteCard: (id: string, createdBy: string) => void; // Update prop type
  updateColumnTitle: (id: string, title: string) => void;
  deleteColumn: (id: string) => void;
};

const Column = ({
  title,
  headingColor,
  cards,
  column,
  setCards,
  updateCardColumn,
  updateCardTitle,
  addCard,
  deleteCard,
  updateColumnTitle,
  deleteColumn,
}: ColumnProps) => {
  const [active, setActive] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const { role, user } = useRole(); // Get the role from context

  const handleDragStart = (e: DragEvent, card: CardType) => {
    e.dataTransfer.setData("cardId", card.id);
    e.dataTransfer.setData("currentColumn", card.column_name);
  };

  const handleDrop = async (e: DragEvent) => {
    const cardId = e.dataTransfer.getData("cardId");
    const currentColumn = e.dataTransfer.getData("currentColumn");

    if (currentColumn !== column.title) {
      await updateCardColumn(cardId, column.title);
      setCards((prevCards) => {
        const updatedCards = prevCards.map((card) =>
          card.id === cardId ? { ...card, column_name: column.title } : card
        );
        return updatedCards;
      });
    }
    setActive(false);
    clearHighlights();
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
  };

  const clearHighlights = (els?: HTMLElement[]) => {
    const indicators = els || getIndicators();
    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e: DragEvent) => {
    const indicators = getIndicators();
    clearHighlights(indicators);
    const el = getNearestIndicator(e, indicators);
    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (e: DragEvent, indicators: HTMLElement[]) => {
    const DISTANCE_OFFSET = 50;
    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );
    return el;
  };

  const getIndicators = () => {
    return Array.from(
      document.querySelectorAll(
        `[data-column="${column.title}"]`
      ) as unknown as HTMLElement[]
    );
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const handleAddCard = async (title: string) => {
    await addCard(column.title, title);
  };

  const handleDeleteCard = async (id: string, createdBy: string) => {
    await deleteCard(id, createdBy);
  };

  const handleEditColumn = () => {
    setIsEditing(true);
  };

  const handleColumnTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const handleColumnTitleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateColumnTitle(column.id, newTitle);
    setIsEditing(false);
  };

  return (
    <Card className="h-full max-w-sm">
      <CardContent className="h-full flex flex-col p-4">
        <div className="mb-3 flex items-center justify-between group">
          {isEditing ? (
            <form onSubmit={handleColumnTitleSubmit} className="flex-1">
              <input
                type="text"
                value={newTitle}
                onChange={handleColumnTitleChange}
                className="w-full rounded border border-violet-400 bg-violet-400/20 p-1 text-sm focus:outline-0"
              />
              <div className="mt-1.5 flex items-center justify-end gap-1.5">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded bg-neutral-50 px-2 py-1 dark:text-black text-xs transition-colors hover:bg-neutral-300"
                >
                  <span>Save</span>
                </button>
              </div>
            </form>
          ) : (
            <>
              <h3 className={`font-medium ${headingColor}`}>{title}</h3>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {role === "super admin" && (
                  <button
                    onClick={handleEditColumn}
                    className="text-yellow-500"
                  >
                    <Pencil1Icon />
                  </button>
                )}
                {role === "super admin" && (
                  <button
                    onClick={() => deleteColumn(column.id)}
                    className="text-red-500"
                  >
                    <TrashIcon />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`flex-grow overflow-y-auto ${
            active ? "bg-neutral-800/50" : "bg-neutral-800/0"
          }`}
        >
          <div className="flex flex-col gap-2">
            {cards.map((c) => (
              <KanbanCard
                key={c.id}
                {...c}
                handleDragStart={handleDragStart}
                handleDeleteCard={handleDeleteCard}
                updateCardTitle={updateCardTitle}
              />
            ))}
            <DropIndicator beforeId={null} column_name={column.title} />
          </div>
        </div>
        <AddCard column_name={column.title} handleAddCard={handleAddCard} />
      </CardContent>
    </Card>
  );
};

type CardProps = CardType & {
  handleDragStart: Function;
  handleDeleteCard: (id: string, createdBy: string) => void; // Update prop type
  updateCardTitle: (id: string, title: string) => void;
};

const KanbanCard = ({
  title,
  id,
  column_name,
  created_by,
  handleDragStart,
  handleDeleteCard,
  updateCardTitle,
}: CardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const { role, user } = useRole(); // Get the role and user from context

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const handleTitleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateCardTitle(id, newTitle);
    setIsEditing(false);
  };

  return (
    <>
      <DropIndicator beforeId={id} column_name={column_name} />
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, { title, id, column_name })}
        className="cursor-grab rounded border border-neutral-700  p-3 active:cursor-grabbing group"
        data-before={id} // Add this line
      >
        {isEditing ? (
          <form onSubmit={handleTitleSubmit} className="flex-1">
            <input
              type="text"
              value={newTitle}
              onChange={handleTitleChange}
              className="w-full rounded border border-violet-400  p-1 text-sm  focus:outline-0"
            />
            <div className="mt-1.5 flex items-center justify-end gap-1.5">
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded  px-2 py-1 text-xs  transition-colors hover:bg-neutral-300"
              >
                <span>Save</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="flex justify-between items-center">
            <p className="text-sm ">{title}</p>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {(role === "super admin" || user.email === created_by) && (
                <button onClick={handleEdit} className="text-yellow-500">
                  <Pencil1Icon />
                </button>
              )}
              {(role === "super admin" ||
                (role === "admin" && user.email === created_by)) && (
                <button
                  onClick={() => handleDeleteCard(id, created_by)}
                  className="text-red-500"
                >
                  <TrashIcon />
                </button>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
};

type DropIndicatorProps = {
  beforeId: string | null;
  column_name: string;
};

const DropIndicator = ({ beforeId, column_name }: DropIndicatorProps) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column_name}
      className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
    />
  );
};

const BurnBarrel = ({
  setCards,
}: {
  setCards: Dispatch<SetStateAction<CardType[]>>;
}) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDrop = (e: DragEvent) => {
    const cardId = e.dataTransfer.getData("cardId");
    setCards((pv) => pv.filter((c) => c.id !== cardId));
    setActive(false);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    ></div>
  );
};

type AddCardProps = {
  column_name: string;
  handleAddCard: (title: string) => void;
};

const AddCard = ({ column_name, handleAddCard }: AddCardProps) => {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim().length) return;
    await handleAddCard(text.trim());
    setAdding(false);
    setText(""); // Reset text after adding
  };

  return (
    <>
      {adding ? (
        <motion.form layout onSubmit={handleSubmit}>
          <textarea
            onChange={(e) => setText(e.target.value)}
            value={text} // Ensure value is controlled
            autoFocus
            placeholder="Add new task..."
            className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm  placeholder-violet-300 focus:outline-0"
          />
          <div className="mt-1.5 flex items-center justify-end gap-1.5">
            <button
              onClick={() => setAdding(false)}
              className="px-3 py-1.5 text-xs  transition-colors hover:text-neutral-50"
            >
              Close
            </button>
            <Button
              variant="linkHover1"
              type="submit"
              className="flex items-center gap-1.5 rounded  px-3 py-1.5 text-xs  transition-colors hover:bg-neutral-600"
            >
              <span>Add</span>
              <PlusIcon />
            </Button>
          </div>
        </motion.form>
      ) : (
        <motion.button
          layout
          onClick={() => setAdding(true)}
          className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-500 transition-colors hover:text-neutral-50"
        >
          <span>Add Topic</span>
          <PlusIcon />
        </motion.button>
      )}
    </>
  );
};

type AddColumnProps = {
  handleAddColumn: (title: string) => void;
};

const AddColumn = ({ handleAddColumn }: AddColumnProps) => {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim().length) return;
    await handleAddColumn(text.trim());
    setAdding(false);
  };

  return (
    <>
      {adding ? (
        <motion.form
          layout
          onSubmit={handleSubmit}
          className="flex items-center gap-2"
        >
          <input
            onChange={(e) => setText(e.target.value)}
            autoFocus
            placeholder="Add new column..."
            className="rounded border border-violet-400 bg-violet-400/20 p-1 text-sm  focus:outline-0"
          />
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setAdding(false)}
              className="px-2 py-1 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
            >
              Close
            </button>
            <Button
              variant="linkHover1"
              type="submit"
              className="flex items-center gap-1.5 rounded  px-2 py-1 text-xs  transition-colors hover:bg-neutral-600"
            >
              <span>Add</span>
              <PlusIcon />
            </Button>
          </div>
        </motion.form>
      ) : (
        <motion.button
          layout
          onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 px-3 py-1 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
        >
          <span>Add Staff</span>
          <PlusIcon />
        </motion.button>
      )}
    </>
  );
};

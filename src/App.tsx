/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import bgImage from './assets/new.png';
import { 
  Search, 
  User, 
  Puzzle, 
  Book, 
  X, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  RotateCcw,
  GripVertical
} from 'lucide-react';

// --- Types ---
interface Vocab {
  r: string;
  d: string;
}

interface Clue {
  id: number;
  icon: string;
  name: string;
  color: string;
  rus: string;
  vocab: Vocab[];
}

interface Suspect {
  id: string;
  icon: string;
  name: string;
  role: string;
  hint: string;
}

interface Sentence {
  id: string;
  text: string;
  cor: number;
}

// --- Dictionary for Students ---
const DICTIONARY: Record<string, string> = {
  'стоящего': 'Причастие от глагола "стоять". Тот, который находится в вертикальном положении.',
  'оставленные': 'Причастие от глагола "оставить". Те, которые кто-то положил и не забрал.',
  'страдавшая': 'Причастие от глагола "страдать". Та, которая чувствовала боль или мучение.',
  'увидев': 'Деепричастие от глагола "увидеть". Когда человек посмотрел и заметил что-то.',
  'пожелтевшую': 'Причастие от глагола "пожелтеть". Та, которая стала желтого цвета от времени.',
  'вырезано': 'Краткое причастие от глагола "вырезать". Часть чего-то, которую удалили ножом или ножницами.',
  'желавший': 'Причастие от глагола "желать". Тот, кто очень хотел чего-то.',
  'висящих': 'Причастие от глагола "висеть". Те, которые закреплены наверху и не касаются пола.',
  'содержащий': 'Причастие от глагола "содержать". Тот, внутри которого что-то есть.',
  'подтверждающие': 'Причастие от глагола "подтверждать". Те, которые доказывают правду.',
  'скрытый': 'Причастие от глагола "скрыть". Тот, который спрятали от других.',
  'украденных': 'Причастие от глагола "украсть". Те вещи, которые кто-то забрал незаконно.',
  'рассыпанного': 'Причастие от глагола "рассыпать". То, что упало и распределилось по поверхности (например, сахар или порошок).',
  'светящийся': 'Причастие от глагола "светиться". Тот, который дает свет в темноте.',
  'написанный': 'Причастие от глагола "написать". Текст, который создали ручкой или напечатали.',
  'прочитав': 'Деепричастие от глагола "прочитать". Когда человек закончил читать текст.',
  'сожженного': 'Причастие от глагола "сжечь". То, что уничтожили огнем.',
  'кажущийся': 'Причастие от глагола "казаться". Тот, который создает определенное впечатление (может быть неправдой).',
  'выписанный': 'Причастие от глагола "выписать". Документ (рецепт), который официально составил врач.',
  'являющийся': 'Причастие от глагола "являться". Тот, который по сути есть кто-то или что-то.',
  'помятые': 'Причастие от глагола "помять". Вещи (листья), которые потеряли форму после давления.',
  'потерянную': 'Причастие от глагола "потерять". Вещь, которую человек случайно оставил и не может найти.',
  'опровергающая': 'Причастие от глагола "опровергать". Та, которая доказывает, что слова — это ложь.',
  'выглядящий': 'Причастие от глагола "выглядеть". Тот, кто имеет определенный внешний вид.',
  'найденная': 'Причастие от глагола "найти". Та вещь, которую искали и обнаружили.',
  'имевший': 'Причастие от глагола "иметь". Тот, у кого что-то было в прошлом.',
  'знавший': 'Причастие от глагола "знать". Тот, кто владел информацией.',
  'скрывающая': 'Причастие от глагола "скрывать". Та, которая намеренно не говорит правду.',
  'потерявший': 'Причастие от глагола "потерять". Тот, кто лишился чего-то важного (денег, семьи).',
  'видевшие': 'Причастие от глагола "видеть". Те люди, которые были свидетелями события.',
  'закончившаяся': 'Причастие от глагола "закончиться". Та, которая пришла к концу.',
  'воспользовавшись': 'Деепричастие от глагола "воспользоваться". Когда кто-то использовал шанс или момент.',
  'похитив': 'Деепричастие от глагола "похитить". Когда кто-то украл что-то.',
  'уходя': 'Деепричастие от глагола "уходить". В процессе того, как человек покидает место.',
  'пришедшей': 'Причастие от глагола "прийти". Та, которая пришла куда-то.',
  'улыбается': 'Глагол "улыбаться". Выражать радость или доброжелательность, растягивая губы.',
  'лежат': 'Глагол "лежать". Находиться в горизонтальном положении на поверхности.',
  'принимала': 'Глагол "принимать". В данном контексте — пить лекарства.',
  'выглядят': 'Глагол "выглядеть". Иметь какой-то внешний вид.',
  'обнаружили': 'Глагол "обнаружить". Найти что-то, что было скрыто или неизвестно.',
  'пытался': 'Глагол "пытаться". Делать усилия, чтобы что-то совершить.',
  'наклонена': 'Краткое причастие от "наклонить". Находиться не прямо, а под углом.',
  'спрятан': 'Краткое причастие от "спрятать". Находиться в месте, где никто не видит.',
  'могли': 'Глагол "мочь". Иметь возможность или вероятность что-то сделать.',
  'открыт': 'Краткое причастие от "открыть". Находиться в состоянии, когда доступ внутрь свободен.',
  'напоминает': 'Глагол "напоминать". Быть похожим на что-то или заставлять думать о чем-то.',
  'показывает': 'Глагол "показывать". Делать что-то видимым для других.',
  'гласит': 'Глагол "гласить". Официально сообщать или содержать какой-то текст.',
  'отдашь': 'Глагол "отдать". Передать что-то другому человеку.',
  'пожалеешь': 'Глагол "пожалеть". Чувствовать печаль или раскаяние о сделанном.',
  'становится': 'Глагол "становиться". Начинать быть кем-то или чем-то другим.',
  'находите': 'Глагол "находить". Обнаруживать что-то в результате поиска.',
  'обрывается': 'Глагол "обрываться". Резко заканчиваться.',
  'лежит': 'Глагол "лежать". Находиться на поверхности.',
  'оказался': 'Глагол "оказаться". Случайно или неожиданно попасть куда-то.',
  'заходил': 'Глагол "заходить". Посещать кого-то на короткое время.',
  'клялся': 'Глагол "клясться". Давать торжественное обещание говорить правду.',
  'говорит': 'Глагол "говорить". Сообщать информацию (в данном контексте — свидетельствовать).',
  'утверждает': 'Глагол "утверждать". Настойчиво говорить, что что-то является правдой.',
  'доказывает': 'Глагол "доказывать". Подтверждать фактами истинность чего-либо.',
  'была': 'Глагол "быть". Находиться в определенном состоянии в прошлом.',
  'связывает': 'Глагол "связывать". Показывать логическую или физическую связь между вещами.',
  'жаждал': 'Глагол "жаждать". Очень сильно хотеть чего-то (например, мести).',
  'подтверждают': 'Глагол "подтверждать". Говорить, что информация верна.',
  'содержит': 'Глагол "содержать". Иметь что-то внутри себя.',
  'на': 'Предлог. Указывает на местоположение на поверхности чего-либо.',
  'краю': 'Существительное "край". Самая дальняя часть поверхности чего-либо.',
  'стола': 'Существительное "стол". Мебель, за которой едят или работают.',
  'окна': 'Существительное "окно". Отверстие в стене для света и воздуха.',
  'две': 'Числительное. Количество (2).',
  'белые': 'Прилагательное. Цвет снега или молока.',
  'таблетки': 'Существительное. Лекарство в форме маленьких твердых кружков.',
  'кем-то': 'Местоимение. Неизвестный человек.',
  'без': 'Предлог. Указывает на отсутствие чего-либо.',
  'упаковки': 'Существительное. Коробка или пакет, в котором продается товар.',
  'бессонницы': 'Существительное. Состояние, когда человек не может уснуть.',
  'часто': 'Наречие. Много раз, регулярно.',
  'лекарства': 'Существительное. Вещества для лечения болезней.',
  'подозрительно': 'Наречие. Так, что вызывает сомнения или недоверие.',
  'новыми': 'Прилагательное. Те, которые сделаны или куплены недавно.',
  'можно': 'Слово, выражающее возможность.',
  'подумать': 'Глагол. Использовать мозг для анализа или воображения.',
  'положили': 'Глагол "положить". Поместить что-то на поверхность.',
  'сюда': 'Наречие. В это место.',
  'совсем': 'Наречие. Полностью, абсолютно.',
  'недавно': 'Наречие. Короткое время назад.',
  'между': 'Предлог. В пространстве, которое разделяет два предмета.',
  'подушками': 'Существительное "подушка". Мягкая вещь для сна или сидения.',
  'дивана': 'Существительное "диван". Мягкая мебель для отдыха нескольких человек.',
  'вы': 'Местоимение. Обращение к человеку.',
  'старую': 'Прилагательное. Та, которая существует много лет.',
  'фотографию': 'Существительное. Изображение, сделанное камерой.',
  'ней': 'Местоимение. Указывает на фотографию.',
  'рядом': 'Наречие. Близко, около.',
  'мужчиной': 'Существительное "мужчина". Взрослый человек мужского пола.',
  'лицо': 'Существительное. Передняя часть головы человека.',
  'грубо': 'Наречие. Резко, без осторожности или вежливости.',
  'ножом': 'Существительное "нож". Инструмент для резания.',
  'кто-то': 'Местоимение. Какой-то человек.',
  'правду': 'Существительное. То, что соответствует реальности.',
  'стереть': 'Глагол. Удалить изображение или информацию.',
  'этого': 'Местоимение. Указывает на конкретный предмет или человека.',
  'человека': 'Существительное. Личность, мужчина или женщина.',
  'жизни': 'Существительное "жизнь". Период существования живого существа.',
};

// --- Data ---
const CLUES: Clue[] = [
  { 
    id: 1, 
    icon: '🍎', 
    name: 'Обеденный стол', 
    color: '#e63946', 
    rus: 'На краю стола, стоящего у окна, лежат две белые таблетки, оставленные кем-то без упаковки. Наташа, страдавшая от бессонницы, часто принимала лекарства, но эти таблетки выглядят подозрительно новыми. Увидев их, можно подумать, что их положили сюда совсем недавно.', 
    vocab: [
      { r: 'стоящего', d: 'причастие от глагола "стоять" (который стоит)' },
      { r: 'оставленные', d: 'причастие от глагола "оставить" (которые оставили)' },
      { r: 'страдавшая', d: 'причастие от глагола "страдать" (которая страдала)' },
      { r: 'увидев', d: 'деепричастие от глагола "увидеть" (когда увидел)' }
    ] 
  },
  { 
    id: 2, 
    icon: '🛋️', 
    name: 'Бархатный диван', 
    color: '#f4a261', 
    rus: 'Между подушками дивана вы обнаружили старую, пожелтевшую фотографию. На ней Наташа улыбается рядом с мужчиной, чьё лицо было грубо вырезано ножом. Кажется, кто-то, желавший скрыть правду, пытался стереть этого человека из её жизни.', 
    vocab: [
      { r: 'пожелтевшую', d: 'причастие: ставшую желтой от времени' },
      { r: 'вырезано', d: 'краткое причастие от глагола "вырезать"' },
      { r: 'желавший', d: 'причастие от глагола "желать" (который желал)' }
    ] 
  },
  { 
    id: 3, 
    icon: '🖼️', 
    name: 'Стена с картинами', 
    color: '#06d6a0', 
    rus: 'Одна из дорогих картин, висящих на стене, наклонена под углом. За тяжелой рамой спрятан конверт, содержащий банковские выписки. Эти документы, подтверждающие огромные долги Виктора, могли стать причиной серьезного конфликта.', 
    vocab: [
      { r: 'висящих', d: 'причастие от глагола "висеть" (которые висят)' },
      { r: 'содержащий', d: 'причастие от глагола "содержать" (который содержит)' },
      { r: 'подтверждающие', d: 'причастие от глагола "подтверждать"' }
    ] 
  },
  { 
    id: 4, 
    icon: '🏔️', 
    name: 'Скрытый сейф', 
    color: '#8338ec', 
    rus: 'Сейф, скрытый за пейзажем, открыт настежь. Внутри нет ни денег, ни документов, украденных преступником. Лишь тонкий слой белого порошка, рассыпанного на полке, напоминает о случившемся.', 
    vocab: [
      { r: 'скрытый', d: 'причастие от глагола "скрыть" (который скрыли)' },
      { r: 'украденных', d: 'причастие от глагола "украсть" (которые украли)' },
      { r: 'рассыпанного', d: 'причастие от глагола "рассыпать"' }
    ] 
  },
  { 
    id: 5, 
    icon: '☎️', 
    name: 'Рабочий телефон', 
    color: '#118ab2', 
    rus: 'Экран телефона, светящийся в темноте, показывает входящее сообщение. Текст, написанный заглавными буквами, гласит: «Если ты не отдашь мне контракт завтра, ты пожалеешь об этом». Прочитав это, вы понимаете, что Наташе угрожали.', 
    vocab: [
      { r: 'светящийся', d: 'причастие от глагола "светиться"' },
      { r: 'написанный', d: 'причастие от глагола "написать"' },
      { r: 'прочитав', d: 'деепричастие от глагола "прочитать"' }
    ] 
  },
  { 
    id: 6, 
    icon: '🔥', 
    name: 'Мраморный камин', 
    color: '#ffd166', 
    rus: 'В еще теплом пепле камина вы находите обрывок письма, сожженного почти полностью. Почерк, кажущийся знакомым, принадлежит Игорю. Текст обрывается на фразе: «...твоё предательство будет стоить тебе всего».', 
    vocab: [
      { r: 'сожженного', d: 'причастие от глагола "сжечь" (которое сожгли)' },
      { r: 'кажущийся', d: 'причастие от глагола "казаться"' }
    ] 
  },
  { 
    id: 7, 
    icon: '📺', 
    name: 'Антикварная тумба', 
    color: '#52b788', 
    rus: 'В нижнем ящике тумбы лежит медицинский рецепт, выписанный на имя Алины Соколовой. Препарат, являющийся сильным снотворным, становится смертельным при передозировке. Непонятно, как этот документ оказался здесь.', 
    vocab: [
      { r: 'выписанный', d: 'причастие от глагола "выписать"' },
      { r: 'являющийся', d: 'причастие от глагола "являться" (который является)' }
    ] 
  },
  { 
    id: 8, 
    icon: '🌿', 
    name: 'Домашнее растение', 
    color: '#f4a261', 
    rus: 'Листья фикуса, помятые во время борьбы, выглядят безжизненно. В земле вы находите золотую запонку, потерянную Виктором. Он клялся, что не заходил к Наташе, но эта находка, опровергающая его слова, говорит об обратном.', 
    vocab: [
      { r: 'помятые', d: 'причастие от глагола "помять"' },
      { r: 'потерянную', d: 'причастие от глагола "потерять"' },
      { r: 'опровергающая', d: 'причастие от глагола "опровергать"' }
    ] 
  }
];

const SUSPECTS: Suspect[] = [
  { 
    id: 'viktor', 
    icon: '🕴', 
    name: 'Виктор Ларионов', 
    role: 'Деловой партнер', 
    hint: 'Виктор, выглядящий подавленным, утверждает, что работал в офисе. Однако запонка, найденная в земле, доказывает его присутствие в квартире. Он — человек, имевший доступ к сейфу и знавший все секреты Наташи.' 
  },
  { 
    id: 'alina', 
    icon: '👩‍🦱', 
    name: 'Алина Соколова', 
    role: 'Главная конкурентка', 
    hint: 'Алина, не скрывающая своей неприязни, была в ярости из-за потерянного контракта. Рецепт, выписанный на её имя, связывает её с местом преступления. Она — женщина, способная на всё ради успеха.' 
  },
  { 
    id: 'igor', 
    icon: '👨‍💼', 
    name: 'Игорь Петров', 
    role: 'Бывший супруг', 
    hint: 'Игорь, потерявший состояние после развода, жаждал мести. Соседи, видевшие его машину, подтверждают, что он был рядом. Письмо, сожженное в камине, содержит прямые угрозы, написанные его рукой.' 
  },
];

const PUZZLE_SENTENCES: Sentence[] = [
  { id: 'a', text: 'Вечером в квартире Наташи произошла встреча, закончившаяся трагедией.', cor: 1 },
  { id: 'b', text: 'Преступник, воспользовавшись моментом, подсыпал снотворное в напиток.', cor: 2 },
  { id: 'c', text: 'Пока жертва спала, убийца открыл сейф, похитив важные документы.', cor: 3 },
  { id: 'd', text: 'Уходя в спешке, преступник оставил на месте улику, найденную полицией.', cor: 4 },
  { id: 'e', text: 'Тело было обнаружено утром подругой, пришедшей навестить Наташу.', cor: 5 },
];

const SOUNDS = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  clue: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
  success: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  error: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  open: 'https://assets.mixkit.co/active_storage/sfx/2567/2567-preview.mp3'
};

// --- Helper Components ---
const NavButton = ({ children, active, onClick, disabled, icon }: { children: React.ReactNode, active: boolean, onClick: () => void, disabled?: boolean, icon: React.ReactNode }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center gap-2 bg-[#251830] border border-[#4a3060] text-[#a990c8] px-5 py-2 rounded-full text-sm font-bold tracking-tight cursor-pointer transition-all ${active ? 'bg-gradient-to-br from-[#e63946] to-[#f4a261] border-transparent text-white shadow-lg' : ''} ${disabled ? 'opacity-35 cursor-not-allowed' : 'hover:border-[#ffd166]'}`}
  >
    {icon}
    {children}
  </button>
);

const Hotspot = ({ id, top, left, icon, found, onClick }: { id: number, top: string, left: string, icon: string, found: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="absolute w-11 h-11 bg-black/60 border-2 border-[#ffd166] rounded-full flex items-center justify-center text-xl cursor-pointer transition-all z-10 shadow-[0_0_15px_#ffd166] hover:scale-125 hover:bg-[#e63946] hover:shadow-[0_0_20px_#e63946] animate-pulse"
    style={{ top, left, opacity: found ? 0.4 : 1 }}
  >
    {icon}
  </button>
);

// --- Main App ---
export default function App() {
  const [screen, setScreen] = useState<'intro' | 'main' | 'result'>('intro');
  const [tab, setTab] = useState<'room' | 'vote' | 'puzzle' | 'nb'>('room');
  const [foundClues, setFoundClues] = useState<number[]>([]);
  const [savedVocab, setSavedVocab] = useState<Vocab[]>([]);
  const [savedClues, setSavedClues] = useState<number[]>([]);
  const [votedSuspect, setVotedSuspect] = useState<string | null>(null);
  const [puzzleState, setPuzzleState] = useState<Record<number, string>>({});
  const [puzzleFeedback, setPuzzleFeedback] = useState<string | null>(null);
  const [selectedClue, setSelectedClue] = useState<Clue | null>(null);
  const [soundOn, setSoundOn] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [definingWord, setDefiningWord] = useState<string | null>(null);
  const [aiDefinition, setAiDefinition] = useState<string | null>(null);

  const getWordDefinition = (word: string) => {
    const cleanWord = word.replace(/[.,!?;:()]/g, "").toLowerCase().trim();
    if (!cleanWord || cleanWord.length < 2) return;

    setDefiningWord(word.replace(/[.,!?;:()]/g, "").trim());
    playSound('click');

    const definition = DICTIONARY[cleanWord];
    if (definition) {
      setAiDefinition(definition);
    } else {
      setAiDefinition("Определение для этого слова пока не добавлено в словарь.");
    }
  };

  const playSound = (type: keyof typeof SOUNDS) => {
    if (!soundOn) return;
    const audio = new Audio(SOUNDS[type]);
    audio.volume = 0.4;
    audio.play().catch(() => {});
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const handleClueClick = (id: number) => {
    const clue = CLUES.find(c => c.id === id);
    if (clue) {
      if (!foundClues.includes(id)) {
        setFoundClues(prev => [...prev, id]);
        playSound('clue');
      } else {
        playSound('open');
      }
      setSelectedClue(clue);
    }
  };

  const saveVocab = (v: Vocab) => {
    if (!savedVocab.find(x => x.r === v.r)) {
      setSavedVocab(prev => [...prev, v]);
      playSound('success');
      showToast('Слово сохранено!');
    }
  };

  const saveClueToNotebook = (id: number) => {
    if (!savedClues.includes(id)) {
      setSavedClues(prev => [...prev, id]);
      playSound('success');
      showToast('Улика сохранена!');
    }
  };

  const submitAccusation = () => {
    if (!votedSuspect) {
      playSound('error');
      showToast('Сначала выберите подозреваемого!');
      return;
    }
    playSound('success');
    setScreen('result');
  };

  const checkPuzzle = () => {
    let correct = 0;
    PUZZLE_SENTENCES.forEach(s => {
      if (puzzleState[s.cor] === s.id) correct++;
    });
    if (correct === PUZZLE_SENTENCES.length) playSound('success');
    else playSound('error');
    setPuzzleFeedback(`Результат: ${correct} / ${PUZZLE_SENTENCES.length} правильно`);
  };

  const resetPuzzle = () => {
    playSound('click');
    setPuzzleState({});
    setPuzzleFeedback(null);
  };

  const onDrop = (e: React.DragEvent, slot: number) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text');
    setPuzzleState(prev => ({ ...prev, [slot]: id }));
    playSound('click');
  };

  return (
    <div className="min-h-screen bg-[#1a1025] text-[#f0e6ff] font-sans selection:bg-[#ff6b6b] selection:text-white relative overflow-x-hidden">
      {/* Immersive Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center opacity-40 pointer-events-none grayscale-[30%]"
        style={{ backgroundImage: `url(${bgImage})`, backgroundColor: '#1a1025' }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-[#1a1025]/80 via-[#1a1025]/95 to-[#1a1025] pointer-events-none" />

      {/* Sound Toggle */}
      <button 
        onClick={() => setSoundOn(!soundOn)}
        className="fixed top-5 right-5 w-11 h-11 bg-[#251830]/80 backdrop-blur-md border-2 border-[#4a3060] rounded-full flex items-center justify-center cursor-pointer z-50 hover:border-[#ffd166] transition-colors"
      >
        {soundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-5 right-5 bg-[#2e1f3e] border-2 border-[#06d6a0] text-[#06d6a0] px-6 py-3 rounded-full text-sm font-bold z-[9999] shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative max-w-[1000px] mx-auto p-4 z-10">
        {screen === 'intro' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-center py-10 px-4"
          >
            <div className="text-[12px] tracking-[5px] text-[#ffd166] uppercase mb-4">Дело №001 — Отдел убийств</div>
            <h1 className="font-serif text-4xl md:text-6xl text-[#fff9f0] leading-tight mb-4">Смерть в гостиной</h1>
            <p className="text-xl md:text-2xl text-[#a990c8] italic mb-8">Москва, февраль. Модель найдена мертвой на полу своей квартиры.</p>
            <div className="inline-block bg-gradient-to-r from-[#e63946] to-[#f4a261] text-white text-[14px] tracking-[2px] px-6 py-2 rounded-full mb-8 font-bold">
              🎯 УРОВЕНЬ: B1 (СРЕДНИЙ)
            </div>
            <div className="bg-[#251830]/90 backdrop-blur-xl border border-[#4a3060] rounded-3xl p-10 max-w-[750px] mx-auto mb-12 text-left text-xl md:text-2xl leading-relaxed shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <strong className="text-[#ffd166] text-2xl block mb-6 border-b border-[#4a3060] pb-2">📜 Материалы дела:</strong> 
              <p className="mb-6">Известная топ-модель <strong>Наташа Волкова</strong> была обнаружена без признаков жизни в своей роскошной гостиной. Дверь была заперта изнутри, но в комнате царит беспорядок.</p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-[#e63946] mt-1">🔍</span>
                  <span>Исследуйте <strong>8 ключевых зон</strong> в комнате, чтобы собрать доказательства.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#e63946] mt-1">📖</span>
                  <span>Изучайте новые слова. Нажимайте на них, чтобы добавить в свой <strong>следственный блокнот</strong>.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#e63946] mt-1">⚖️</span>
                  <span>Сопоставьте факты и вынесите вердикт. Ошибка может стоить свободы невиновному.</span>
                </li>
              </ul>
            </div>
            <button 
              onClick={() => { playSound('click'); setScreen('main'); }}
              className="bg-gradient-to-br from-[#e63946] to-[#c1121f] text-white px-16 py-5 rounded-full text-xl font-black tracking-[2px] cursor-pointer shadow-[0_10px_30px_rgba(230,57,70,0.4)] hover:scale-105 hover:shadow-[0_15px_40px_rgba(230,57,70,0.6)] active:scale-95 transition-all"
            >
              🚀 НАЧАТЬ РАССЛЕДОВАНИЕ
            </button>
          </motion.div>
        )}

        {screen === 'main' && (
          <div className="animate-in fade-in duration-500">
            {/* Progress Bar */}
            <div className="h-2 bg-[#4a3060] rounded-full mb-6 overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#e63946] via-[#f4a261] to-[#ffd166]"
                initial={{ width: 0 }}
                animate={{ width: `${(foundClues.length / 8) * 100}%` }}
              />
            </div>

            {/* Nav */}
            <div className="flex gap-4 pb-8 flex-wrap mb-8 border-b border-[#4a3060]">
              <NavButton active={tab === 'room'} onClick={() => { playSound('click'); setTab('room'); }} icon={<Search size={22} />}>Осмотр места</NavButton>
              <NavButton active={tab === 'vote'} onClick={() => { playSound('click'); setTab('vote'); }} icon={<User size={22} />}>Допросы</NavButton>
              <NavButton 
                active={tab === 'puzzle'} 
                onClick={() => { playSound('click'); setTab('puzzle'); }} 
                disabled={foundClues.length < 8}
                icon={<Puzzle size={22} />}
              >
                Реконструкция
              </NavButton>
              <NavButton active={tab === 'nb'} onClick={() => { playSound('click'); setTab('nb'); }} icon={<Book size={22} />}>Блокнот</NavButton>
            </div>

            {/* Tab Content */}
            {tab === 'room' && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-serif text-2xl text-[#fff9f0] font-bold">🔎 Гостиная Наташи</h2>
                  <span className="text-[14px] text-[#a990c8] bg-[#251830]/80 px-4 py-1.5 rounded-full border border-[#4a3060] font-bold">
                    Улик найдено: {foundClues.length} / 8
                  </span>
                </div>

                <div 
                  className="relative w-full h-[600px] bg-cover bg-center rounded-2xl border-4 border-[#4a3060] overflow-hidden shadow-2xl mb-6 bg-[#251830]"
                  style={{ backgroundImage: `url(${bgImage})` }}
                >
                  {/* Hotspots */}
                  <Hotspot id={1} top="60%" left="47%" icon="🍎" found={foundClues.includes(1)} onClick={() => handleClueClick(1)} />
                  <Hotspot id={2} top="58%" left="22%" icon="🛋️" found={foundClues.includes(2)} onClick={() => handleClueClick(2)} />
                  <Hotspot id={3} top="25%" left="88%" icon="🖼️" found={foundClues.includes(3)} onClick={() => handleClueClick(3)} />
                  <Hotspot id={4} top="15%" left="13%" icon="🏔️" found={foundClues.includes(4)} onClick={() => handleClueClick(4)} />
                  <Hotspot id={5} top="62%" left="4%" icon="☎️" found={foundClues.includes(5)} onClick={() => handleClueClick(5)} />
                  <Hotspot id={6} top="40%" left="45%" icon="🔥" found={foundClues.includes(6)} onClick={() => handleClueClick(6)} />
                  <Hotspot id={7} top="48%" left="85%" icon="📺" found={foundClues.includes(7)} onClick={() => handleClueClick(7)} />
                  <Hotspot id={8} top="45%" left="73%" icon="🌿" found={foundClues.includes(8)} onClick={() => handleClueClick(8)} />
                </div>

                <p className="text-base text-[#a990c8] mb-4 font-semibold italic">💡 Нажимайте на светящиеся символы, чтобы изучить предметы.</p>
                
                <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3 mt-6">
                  {CLUES.map(c => {
                    const isFound = foundClues.includes(c.id);
                    return (
                      <div 
                        key={c.id}
                        onClick={() => isFound && handleClueClick(c.id)}
                        className={`bg-[#251830] border border-[#4a3060] rounded-xl p-4 transition-all ${isFound ? 'cursor-pointer hover:translate-y-[-3px] hover:shadow-lg border-[#06d6a0]/40 bg-[#06d6a0]/5' : 'opacity-50 grayscale'}`}
                      >
                        <div className="text-3xl mb-2">{isFound ? c.icon : '❓'}</div>
                        <div className="text-base font-bold text-[#f0e6ff]">{isFound ? c.name : 'Закрыто'}</div>
                      </div>
                    );
                  })}
                </div>

                {foundClues.length === 8 && (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-[#06d6a0]/10 border border-[#06d6a0] rounded-2xl p-6 text-lg text-[#06d6a0] mt-6 font-bold text-center"
                  >
                    ✅ Все улики найдены! Теперь перейдите во вкладку <strong>"Подозреваемые"</strong>.
                  </motion.div>
                )}
              </div>
            )}

            {tab === 'vote' && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  {SUSPECTS.map(s => (
                    <div 
                      key={s.id}
                      onClick={() => { playSound('click'); setVotedSuspect(s.id); }}
                      className={`bg-[#251830] border-2 rounded-[2rem] p-10 text-center cursor-pointer transition-all flex flex-col h-full shadow-xl ${votedSuspect === s.id ? 'border-[#ff6b6b] bg-[#e63946]/10 ring-4 ring-[#e63946]/20' : 'border-[#4a3060] hover:border-[#ffd166]'}`}
                    >
                      <div className="text-7xl mb-6 drop-shadow-lg">{s.icon}</div>
                      <div className="text-2xl font-black text-[#fff9f0] mb-3">{s.name}</div>
                      <div className="text-[14px] text-[#ffd166] font-black mb-6 uppercase tracking-[3px] border-y border-[#4a3060] py-2">{s.role}</div>
                      <div className="text-lg md:text-xl text-[#a990c8] leading-relaxed flex-grow italic">"{s.hint}"</div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={submitAccusation}
                  className="w-full bg-gradient-to-br from-[#e63946] to-[#f4a261] text-white py-6 rounded-full text-2xl font-black tracking-[2px] cursor-pointer shadow-[0_15px_40px_rgba(230,57,70,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
                >
                  ⚖️ ВЫНЕСТИ ОКОНЧАТЕЛЬНЫЙ ВЕРДИКТ
                </button>
              </div>
            )}

            {tab === 'puzzle' && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <div className="mb-8">
                  <h3 className="text-[#ffd166] text-sm font-bold uppercase tracking-[4px] mb-4">Список событий</h3>
                  <div className="flex flex-wrap gap-3">
                    {PUZZLE_SENTENCES.map(s => (
                      <div 
                        key={s.id}
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData('text', s.id)}
                        className={`bg-[#251830] border-2 border-[#4a3060] rounded-xl px-5 py-3 text-base font-semibold cursor-grab active:cursor-grabbing hover:border-[#ffd166] transition-colors ${Object.values(puzzleState).includes(s.id) ? 'opacity-30 pointer-events-none' : ''}`}
                      >
                        {s.text}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[#ffd166] text-sm font-bold uppercase tracking-[4px] mb-4">Восстановите хронологию</h3>
                  {[1, 2, 3, 4, 5].map(slot => (
                    <div 
                      key={slot}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => onDrop(e, slot)}
                      className={`min-h-[70px] border-2 border-dashed rounded-2xl px-6 py-4 flex items-center relative transition-all ${puzzleState[slot] ? 'border-solid border-[#118ab2] bg-[#118ab2]/10 text-[#f0e6ff]' : 'border-[#4a3060] text-[#a990c8] bg-black/20'}`}
                    >
                      <div className="flex-1 text-base font-medium pr-20">
                        {puzzleState[slot] ? PUZZLE_SENTENCES.find(s => s.id === puzzleState[slot])?.text : `Событие ${slot}`}
                      </div>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#251830] border border-[#4a3060] flex items-center justify-center text-sm font-bold text-[#a990c8]">
                        {slot}
                      </div>
                      {puzzleState[slot] && (
                        <button 
                          onClick={() => {
                            const newState = { ...puzzleState };
                            delete newState[slot];
                            setPuzzleState(newState);
                          }}
                          className="absolute right-18 top-1/2 -translate-y-1/2 text-[#a990c8] hover:text-white"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 mt-8">
                  <button 
                    onClick={checkPuzzle}
                    className="flex-1 bg-gradient-to-br from-[#e63946] to-[#c1121f] text-white py-4 rounded-full text-lg font-extrabold cursor-pointer"
                  >
                    ✅ ПРОВЕРИТЬ
                  </button>
                  <button 
                    onClick={resetPuzzle}
                    className="px-8 border-2 border-[#4a3060] rounded-full text-[#a990c8] font-bold hover:bg-[#251830]"
                  >
                    <RotateCcw size={24} />
                  </button>
                </div>
                {puzzleFeedback && (
                  <div className="mt-6 text-center text-xl font-bold text-[#ffd166]">{puzzleFeedback}</div>
                )}
              </div>
            )}

            {tab === 'nb' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 space-y-10">
                <div>
                  <h3 className="text-[#ffd166] text-sm font-bold uppercase tracking-[4px] mb-6">Словарь (Новые слова)</h3>
                  {savedVocab.length === 0 ? (
                    <p className="text-[#a990c8] italic text-lg">Вы еще не сохранили ни одного слова.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {savedVocab.map((v, i) => (
                        <div key={i} className="bg-[#251830] p-5 rounded-xl border border-[#4a3060] flex flex-col gap-2">
                          <span className="font-bold text-xl text-[#fff9f0]">{v.r}</span>
                          <span className="text-[#a990c8] text-base leading-relaxed">{v.d}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-[#ffd166] text-sm font-bold uppercase tracking-[4px] mb-6">Улики (Важные находки)</h3>
                  {savedClues.length === 0 ? (
                    <p className="text-[#a990c8] italic text-lg">Вы еще не сохранили ни одной улики.</p>
                  ) : (
                    <div className="space-y-4">
                      {savedClues.map(id => {
                        const c = CLUES.find(x => x.id === id);
                        return (
                          <div key={id} className="bg-[#251830] p-6 rounded-xl border border-[#4a3060]">
                            <div className="text-[#ffd166] text-[12px] font-bold uppercase mb-2 tracking-widest">{c?.name}</div>
                            <div className="text-lg font-semibold leading-relaxed">{c?.rus}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {screen === 'result' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 px-4"
          >
            <h1 className="font-serif text-6xl md:text-8xl text-[#fff9f0] mb-10 drop-shadow-2xl">
              {votedSuspect === 'alina' ? 'Правильно! 🕵️' : 'Ошибка... ❌'}
            </h1>
            <div className="max-w-3xl mx-auto mb-16 text-2xl md:text-3xl text-[#a990c8] leading-relaxed bg-[#251830]/80 p-12 rounded-[3rem] border-2 border-[#4a3060] shadow-2xl">
              {votedSuspect === 'alina' 
                ? "Алина Соколова не смогла смириться с успехом Наташи. Она украла ключ и подмешала сильное снотворное в вино, чтобы найти и уничтожить контракт. Однако доза оказалась смертельной. Вы блестяще справились с расследованием и восстановили справедливость!"
                : "Ваше обвинение не подтвердилось. Хотя у этого человека был мотив, улики указывают на другого. Настоящий убийца всё еще на свободе. Попробуйте еще раз проанализировать все факты и улики."}
            </div>
            <button 
              onClick={() => { playSound('click'); window.location.reload(); }}
              className="bg-gradient-to-br from-[#e63946] to-[#c1121f] text-white px-16 py-6 rounded-full text-2xl font-black tracking-[2px] cursor-pointer shadow-2xl hover:scale-105 active:scale-95 transition-all"
            >
              🔄 НАЧАТЬ ЗАНОВО
            </button>
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedClue && (
          <div className="fixed inset-0 bg-black/90 z-[999] flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#2e1f3e] border-2 border-[#4a3060] rounded-[2.5rem] max-w-[800px] w-full p-12 relative max-h-[95vh] overflow-y-auto shadow-[0_0_100px_rgba(0,0,0,0.8)]"
            >
              <button 
                onClick={() => { playSound('click'); setSelectedClue(null); }}
                className="absolute top-8 right-8 bg-white/10 border-none text-white w-12 h-12 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors z-20"
              >
                <X size={28} />
              </button>
              <div className="text-[#ffd166] text-sm tracking-[6px] font-black mb-4 uppercase">Протокол осмотра</div>
              <h2 className="font-serif text-5xl text-[#fff9f0] mb-8 border-b-2 border-[#4a3060] pb-4">{selectedClue.name}</h2>
              
              <div className="bg-[#e63946]/10 border-l-8 border-[#ff6b6b] p-8 rounded-r-2xl mb-10 text-2xl text-[#fff9f0] leading-[1.8] font-medium italic shadow-inner">
                {selectedClue.rus.split(' ').map((word, idx) => (
                  <span 
                    key={idx} 
                    onClick={() => getWordDefinition(word)}
                    className="cursor-pointer hover:text-[#ffd166] hover:bg-[#ffd166]/10 px-1 rounded transition-colors inline-block"
                  >
                    {word}{' '}
                  </span>
                ))}
              </div>

              <AnimatePresence>
                {definingWord && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mb-10 overflow-hidden"
                  >
                    <div className="bg-[#1a1025] border-2 border-[#ffd166] p-6 rounded-2xl relative">
                      <button 
                        onClick={() => { setDefiningWord(null); setAiDefinition(null); }}
                        className="absolute top-4 right-4 text-[#a990c8] hover:text-white"
                      >
                        <X size={18} />
                      </button>
                      <h4 className="text-[#ffd166] font-black text-xl mb-2 uppercase tracking-widest">Значение: {definingWord}</h4>
                      <div className="space-y-4">
                        <p className="text-lg text-[#f0e6ff] leading-relaxed">{aiDefinition}</p>
                        <button 
                          onClick={() => saveVocab({ r: definingWord || '', d: aiDefinition || '' })}
                          className="text-sm font-bold text-[#06d6a0] hover:underline flex items-center gap-1"
                        >
                          <Book size={14} /> Сохранить в блокнот
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="space-y-6 mb-12">
                <h4 className="text-[#ffd166] text-sm font-black uppercase tracking-[4px]">Лингвистический анализ:</h4>
                <div className="grid grid-cols-1 gap-4">
                  {selectedClue.vocab.map((v, i) => (
                    <button 
                      key={i}
                      onClick={() => saveVocab(v)}
                      className={`bg-[#251830] border-2 border-[#4a3060] p-6 rounded-2xl text-left transition-all group ${savedVocab.find(x => x.r === v.r) ? 'bg-[#06d6a0]/10 border-[#06d6a0]' : 'hover:border-[#ffd166] hover:bg-[#2e1f3e]'}`}
                    >
                      <div className="font-black text-2xl text-[#f0e6ff] mb-2 group-hover:text-[#ffd166] transition-colors">{v.r}</div>
                      <div className="text-lg text-[#a990c8] leading-relaxed">{v.d}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => saveClueToNotebook(selectedClue.id)}
                className={`w-full py-6 rounded-full text-xl font-black tracking-[1px] cursor-pointer transition-all shadow-2xl ${savedClues.includes(selectedClue.id) ? 'bg-gradient-to-r from-[#52b788] to-[#06d6a0] text-white' : 'bg-gradient-to-r from-[#e63946] to-[#f4a261] text-white hover:scale-[1.02]'}`}
              >
                {savedClues.includes(selectedClue.id) ? '✅ УЛИКА В БЛОКНОТЕ' : '📥 СОХРАНИТЬ В МАТЕРИАЛЫ ДЕЛА'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

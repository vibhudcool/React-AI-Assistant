import {useState} from 'react';
import { URL } from './constraints';

export default function App(){
  const [query, setquery] = useState('');
  const [result, setResult] = useState([]);
  const [recent, setRecent] = useState([]);
  // const payload = {
  //   "contents": [
  //     {
  //       "parts": [
  //         {
  //           "text": "Explain how AI works in a few words"
  //         }
  //       ]
  //     }
  //   ]
  // }
    
   const askQuery = async () => {
    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3.2",
        prompt: query,
        stream: false,
      }),
    });

    const data = await res.json();
    setResult((prev)=> {
      return [...prev , data.response];
   });
    console.log(data);
  }
  return(
    <div className="grid grid-cols-5 h-screen">
      <div className='col-span-1 bg-zinc-800 text-amber-50 text-center'>
        Recent searches
      </div>
      <div className='col-span-4'>
        <div className="text-amber-300 h-18 text-4xl text-center">Hello User, LLAMA 3.8 Ready to Answer.</div>
        <div className="container h-110 text-amber-50">
          {result.map((item,index)=>{
              return <p key={index}>{item}</p>
          })}
        </div>
      <div className="bg-zinc-800 w-1/2 h-16 pr-5 text-amber-50 m-auto rounded-4xl border border-zinc-700 flex">
      <input type="text" value={query} onChange={(event)=>{setquery(event.target.value)}} className="w-full h-full p-3 outline-none"placeholder="Ask me Anything"></input>

      <button onClick={askQuery}>Ask</button>

        </div>
      </div>
    </div>
  )
}
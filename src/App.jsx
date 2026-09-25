import {useState} from 'react';
// import { URL } from './constraints';

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
  const handleKey = (e) =>{
    if(e.key === "Enter"){
      askQuery();
    }
  }
   const askQuery = async () => {
    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3.2",
        prompt: query,
        stream: true,
      }),
    });
    setRecent((prev)=>{
      return [...prev, query];
    })
    // const data = await res.json();
    const reader = await res.body.getReader();
    const decoder = new TextDecoder();
    let answer = "";
    while(true){
      const {done, value} = await reader.read();
      if(done){
        break;
      }
      const chunk = decoder.decode(value);
      const data = JSON.parse(chunk);
      answer += data.response;
      setResult([answer]);
      
    }
    // console.log(data);
  }
  return(
    <div className="grid grid-cols-5 h-screen">
      <div className='col-span-1 bg-zinc-800 text-amber-50 text-center'>
        Recent Searches 🔍<br></br><br></br>
        {recent.map((item, index)=>{
            return <p className="hover:bg-zinc-500 p-1 mx-auto w-40 rounded-2xl"key={index}>{item}</p>
        })}
      </div>
      <div className='col-span-4'>
        <div className="text-amber-300 h-18 text-4xl text-center">Hello User, LLAMA 3.8 Ready to Answer.</div>
        <div className="container h-110 text-amber-50">
          {/* {recent.map((item,index)=>{
            return <p key = {index}>{item}</p>
          })} */}
          {result.map((item,index)=>{
              return <p key={index} className='hover:bg-zinc-500 bg-zinc-800 rounded-3xl py-5 px-10 w-fit m-2'>{item}</p>
          })}
          
        </div>
      <div className="bg-zinc-800 w-1/2 h-16 px-4 text-amber-50 mx-auto rounded-4xl border border-zinc-700 flex items-center mt-60">
      <input type="text" onKeyDown={handleKey} value={query} onChange={(event)=>{setquery(event.target.value)}} className="flex-1 h-full p-3 outline-none bg-transparent"placeholder="Ask me Anything"></input>

      <button onClick={askQuery} className="bg-zinc-600 hover:bg-zinc-400 rounded-3xl px-6 py-2 transition-colors cursor-pointer active:bg-zinc-700">Ask</button>

        </div>
      </div>
    </div>
  )
}
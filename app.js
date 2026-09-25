import { QUESTIONS, SECTION_NAMES } from './questions.js';
import Alpine from './assets/alpine.esm.js';

function quiz(){
  return {
    view:"dash", QUESTIONS, SECTION_NAMES,
    S:{}, exams:[], session:null,

    init(){
      try{this.S=JSON.parse(localStorage.getItem("ncpermit-v1")||"{}")}catch(e){this.S={}}
      try{this.exams=JSON.parse(localStorage.getItem("ncpermit-v1-exams")||"[]")}catch(e){this.exams=[]}
    },
    save(){localStorage.setItem("ncpermit-v1",JSON.stringify(this.S))},

    // ---- derived ----
    stat(id){return this.S[id]||{seen:0,ok:0,bad:0,streak:0}},
    qById(id){return QUESTIONS.find(q=>q.id===id)},
    seenCount(){return QUESTIONS.filter(q=>this.stat(q.id).seen>0).length},
    accuracy(){
      let ok=0,seen=0;
      for(const q of QUESTIONS){const s=this.stat(q.id);ok+=s.ok;seen+=s.seen}
      return seen?Math.round(ok/seen*100):0;
    },
    troubles(){
      return QUESTIONS.map(q=>({q,s:this.stat(q.id)})).filter(t=>t.s.bad>0)
        .sort((a,b)=>(b.s.bad-b.s.ok)-(a.s.bad-a.s.ok));
    },
    weakestIds(){
      const score=id=>{const s=this.stat(id);return s.bad*3-s.ok+(s.seen?0:2)};
      return [...QUESTIONS].sort((a,b)=>score(b.id)-score(a.id)).slice(0,20).map(q=>q.id);
    },
    sectionIds(key){return QUESTIONS.filter(q=>q.section===key).map(q=>q.id)},
    sectionSeen(key){return this.sectionIds(key).filter(id=>this.stat(id).seen>0).length},
    sectionTotal(key){return this.sectionIds(key).length},
    pct(){return this.session&&this.session.queue.length?Math.round(this.session.correct/this.session.queue.length*100):0},

    // ---- navigation ----
    go(v){this.session=null;this.view=v},
    endSession(){this.session=null},
    reset(){if(confirm("Erase all progress?")){this.S={};this.exams=[];localStorage.removeItem("ncpermit-v1");localStorage.removeItem("ncpermit-v1-exams");this.view="dash"}},

    // ---- sessions ----
    startPractice(ids){
      ids=[...new Set(ids)];
      const score=id=>{const s=this.stat(id);return s.bad*3-s.ok+(s.seen?0:2)};
      const queue=this.shuffle(ids).sort((a,b)=>score(b)-score(a)).slice(0,Math.min(ids.length,20));
      this.session={mode:"practice",queue,i:0,correct:0,answered:false,picked:-1,opts:[],done:false};
      this.loadOpts();
    },
    startExam(){
      this.session={mode:"exam",queue:this.shuffle(QUESTIONS.map(q=>q.id)).slice(0,25),
        i:0,correct:0,answered:false,picked:-1,opts:[],review:[],done:false,pass:false};
      this.loadOpts();
    },
    loadOpts(){
      const q=this.currentQ();
      const opts=q.o.map((t,i)=>({t,correct:i===q.a}));
      this.session.opts=this.session.mode==="exam"?this.shuffle(opts):opts;
      this.session.answered=false;this.session.picked=-1;
    },
    currentQ(){return this.qById(this.session.queue[this.session.i])},
    shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a},

    answer(i){
      const s=this.session;if(!s||s.answered||s.done)return;
      s.picked=i;s.answered=true;
      const q=this.currentQ(), correct=s.opts[i].correct;
      this.S[q.id]=this.S[q.id]||{seen:0,ok:0,bad:0,streak:0};
      const rec=this.S[q.id];rec.seen++;
      correct?(rec.ok++,rec.streak++):(rec.bad++,rec.streak=0);
      this.save();
      if(correct)s.correct++;
      if(s.mode==="exam"){s.review.push({id:q.id,ok:correct,pick:i});s.i++;s.answered=false;s.picked=-1;
        if(s.i>=s.queue.length)this.finishExam();else this.loadOpts();
        return;
      }
    },
    nextQ(){
      const s=this.session;s.i++;
      if(s.i>=s.queue.length){s.done=true;return}
      this.loadOpts();
    },
    confirmEnd(){if(confirm("Grade the exam now?"))this.finishExam()},
    finishExam(){
      const s=this.session;s.pass=s.correct>=20;s.done=true;
      this.exams.push({date:new Date().toLocaleDateString(),score:s.correct,pass:s.pass});
      localStorage.setItem("ncpermit-v1-exams",JSON.stringify(this.exams));
    }
  };
}
Alpine.data('quiz', quiz);
Alpine.start();
window.quiz=quiz;

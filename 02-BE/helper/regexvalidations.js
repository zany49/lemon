
export const emailCheck=(v)=>{
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export const passwordCheck=(p)=>{
return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(p);
}

export const phoneCheck=(p)=>{
return /^[6-9]\d{9}$/.test(p);
}
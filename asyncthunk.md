# AsyncThunk — Poore Q&A

---

**Q: Async kaise kaam karta h normal state variable ko reducer banane se alag — normal wala samjhao phir async wala?**

Normal wale mein tune `increment` function banaya slice mein. `createSlice` ne us function ko dekha aur automatically ek action bana diya —

```typescript
increment = {
  type: "counter/increment",
  payload: undefined,
};
```

`dispatch(increment())` kiya — Redux ne `type` dekha, sahi reducer dhundha, state update kiya. Yeh synchronous h — ek pal mein ho gaya.

AsyncThunk mein problem yeh h — API call time leti h. Redux ka normal reducer wait nahi kar sakta. Toh AsyncThunk ne ek kaam ko teen parts mein tod diya —

```
dispatch(fetchUser())
        ↓
PENDING   → "call shuru hua" → isLoading = true
        ↓
API call chal rahi h...
        ↓
FULFILLED → "data aa gaya"  → user = data, isLoading = false
        ↓
        ya
        ↓
REJECTED  → "error aaya"   → error = message, isLoading = false
```

`createAsyncThunk` ne `fetchUser` ke upar automatically teen cheezein bana di —

```typescript
fetchUser.pending = {
  type: "auth/fetchUser/pending"
}
fetchUser.fulfilled = {
  type: "auth/fetchUser/fulfilled",
  payload: // jo tune return kiya → res.data
}
fetchUser.rejected = {
  type: "auth/fetchUser/rejected",
  error: // jo error aaya
}
```

`return res.data` hua — woh automatically `fetchUser.fulfilled.payload` ban gaya. Kyunki `createAsyncThunk` ka async function ka return value fulfilled k payload mein jaata h.

---

**Q: AsyncThunk ka syntax kya h?**

```typescript
const fetchUser = createAsyncThunk(
  "auth/fetchUser", // identifier — GPS address store k liye
  async () => {
    // async function — API call yahan
    const res = await axiosInstance.get("/user/start");
    return res.data; // yeh fulfilled ka payload banega
  },
);
```

Teen cheezein — pehla identifier string, dusra async function, teesra return value jo fulfilled k payload mein jaayega.

---

**Q: "auth/fetchUser" kiske liye h — dispatch k liye ya store k liye?**

**Store k liye** — dispatch ko sirf function chahiye. Dispatch ko `"auth/fetchUser"` se koi matlab nahi. Yeh string Redux store use karta h — taaki extraReducers mein sahi case dhundh sake —

```
"auth/fetchUser/fulfilled" → store ne type dekha → fulfilled case dhundha → state update
"auth/fetchUser/pending"   → store ne type dekha → pending case dhundha → isLoading:true
```

GPS store ka h — dispatch ka nahi.

---

**Q: registerUser() call kiya toh woh kaisa dikhega andar se?**

`createAsyncThunk` ek function return karta h jiske saath teen string properties bhi hain —

```typescript
registerUser(); // ← function — dispatch karne k liye
registerUser.pending; // ← "auth/register/pending"
registerUser.fulfilled; // ← "auth/register/fulfilled"
registerUser.rejected; // ← "auth/register/rejected"
```

JavaScript mein function pe properties laga sakte hain — `createAsyncThunk` ne yahi kiya. Function bhi h, properties bhi hain saath mein.

---

**Q: return res.data gaya fetchUser k paas — matlab kya?**

Haan — `createAsyncThunk` ne jo async function andar rakha h uska return value automatically `fetchUser.fulfilled.payload` ban jaata h —

```typescript
return res.data
    ↓
fetchUser.fulfilled = {
  type: "auth/fetchUser/fulfilled",
  payload: res.data   // ← yahan aa gaya
}
```

---

**Q: extraReducers kyun — normal reducers mein kyun nahi?**

Normal `reducers` mein tune khud actions banaye — `createSlice` ne manage kiya. AsyncThunk k actions tune nahi banaye — `createAsyncThunk` ne banaye. Toh slice ne kaha —

> "Yeh mere reducers nahi hain, inhe EXTRA mein handle karo"

```
reducers      → tune banaye → slice.actions se export
extraReducers → AsyncThunk ne banaye → builder.addCase se handle
```

```typescript
extraReducers: (builder) => {
  builder
    .addCase(fetchUser.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(fetchUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    })
    .addCase(fetchUser.rejected, (state, action) => {
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = action.error.message || "Something went wrong";
    });
};
```

---

**Q: extraReducers mein "auth/register/pending" ka mention nahi — match kaise hua?**

`registerUser.pending` internally `"auth/register/pending"` hi h — `createAsyncThunk` ne yeh string `registerUser` pe chipka di thi —

```
type aaya → "auth/register/pending"
extraReducers mein dhundha →
.addCase(registerUser.pending) → registerUser.pending = "auth/register/pending"
        ↓
MATCH ✅ → case chala
```

Tu chahe seedha string bhi likh sakta h —

```typescript
.addCase("auth/register/pending", ...)  // yeh bhi same kaam krega
```

Dono ek hi h.

---

**Q: asyncthunk kaise add karta h — fetchUser.pending, fulfilled, rejected aur API ka data bhi?**

`createAsyncThunk` ek aisa object return karta h —

```typescript
registerUser = {
  // function — dispatch karne k liye
  (userData) => async function,

  // teen string properties automatically bani
  pending:   "auth/register/pending",
  fulfilled: "auth/register/fulfilled",
  rejected:  "auth/register/rejected",
}

// jab fulfilled hua toh action kuch aisa dikhta h —
{
  type: "auth/register/fulfilled",
  payload: response.data.user   // ← API se aaya hua data yahan
}
```

`payload` alag se `registerUser` pe nahi hota — woh action k andar hota h jab fulfilled fire hota h.

---

**Q: auth/fetchUser pakka aayega — jabki const loginUser h aur "auth/login" likha h?**

`"auth/login"` sirf ek string h — variable naam `loginUser` se koi matlab nahi Redux ko. Redux sirf yeh string use karta h GPS k liye —

```
"auth/login/pending"
"auth/login/fulfilled"
"auth/login/rejected"
```

Convention k liye `"auth/login"` likhte hain — readable rehta h. Bas extraReducers mein same string match honi chahiye.

---

**Q: dispatch kitni baar chalta h — pending, fulfilled, rejected teeno k liye alag alag?**

Dispatch sirf **ek baar** chalta h — `dispatch(registerUser(userData))`. Lekin AsyncThunk andar se **2 actions** fire karta h —

```
dispatch(registerUser(userData))   // ek baar
        ↓
1. pending    // hamesha fire hoga
        ↓
API call...
        ↓
2. fulfilled  // agar success
YA
2. rejected   // agar fail
```

Pending hamesha fire hoga — fulfilled aur rejected mein se sirf **ek** fire hoga. Dono kabhi saath nahi aayenge.

---

**Q: dispatch ka kaam h store k paas le jaana, store ka kaam h type dekh kar sahi reducer k paas le jaana — sahi h?**

Bilkul sahi —

```
dispatch(registerUser(userData))
        ↓
dispatch ka kaam → store k paas le gaya
        ↓
store ka kaam → type dekha "auth/register/pending"
        ↓
extraReducers mein pending case dhundha → chala diya
```

---

**Q: Middleware kya h — AsyncThunk iske bina kaam karta h?**

Beech mein ek **middleware** h jiska naam h `redux-thunk` — `@reduxjs/toolkit` mein automatically laga hota h. `configureStore` ne khud laga diya.

```
dispatch → middleware (redux-thunk) → store
```

Middleware ne kaha — "function h, seedha store mat bhejo, mein khud chalaunga."

Middleware teen kaam karta h —

- pending khud fire karta h
- async function khud chalata h
- response k hisaab se fulfilled ya rejected khud fire karta h

AsyncThunk ne sirf **recipe** di — "yeh async function chalana h, yeh return karna h." Middleware us recipe ko **actually execute** karta h.

---

**Q: Middleware pehle async function chalta h ya pending fire karta h?**

Pehle **pending** fire karta h — phir async function chalta h —

```
dispatch(registerUser(userData))
        ↓
middleware ne pakda
        ↓
1. PEHLE pending fire kiya → extraReducers → state.loading = true
        ↓
2. PHIR async function chalaya → API call...
        ↓
response aaya → fulfilled
error aaya   → rejected
```

Kyun pehle pending? — Taaki UI ko turant pata chale ki "kuch ho raha h" — `loading:true` ho jaaye aur spinner dikhe. Agar pehle API call karte toh response aane tak UI ko pata hi nahi hota ki kuch chal raha h.

---

**Q: dispatch se state update tak — ek ek step batao**

```
dispatch(registerUser(userData))
        ↓
Middleware ne pakda — "function h"
        ↓
1. PEHLE pending fire kiya
{ type: "auth/register/pending" } → store gaya
extraReducers → pending case mila
state.loading = true
state.error = null
        ↓
2. PHIR async function chalaya
await axiosClient.post('/user/register', userData)
wait ho raha h...
        ↓
success?                          fail?
  ↓                                 ↓
fulfilled fire kiya             rejectWithValue(error)
{ type: "auth/register/fulfilled",  rejected fire kiya
  payload: response.data.user }  { type: "auth/register/rejected",
  ↓                                 payload: error }
store gaya                           ↓
extraReducers →                   store gaya
fulfilled case mila               extraReducers →
state.loading = false             rejected case mila
state.user = action.payload       state.loading = false
state.isAuthenticated = true      state.error = action.payload.message
                                  state.isAuthenticated = false
```

**Q: API call se data aayega aur woh stored rahega fetchUser mein — toh usmein payload hota h kya?**

Nahi — `fetchUser` mein data store nahi hota. `fetchUser` sirf ek function h — data store nahi karta.

Data `action` mein hota h — jab fulfilled fire hota h tab —

```
return res.data        // tune async function mein return kiya
      ↓
middleware ne pakda
      ↓
fulfilled action banaya →
{ type: "auth/fetchUser/fulfilled", payload: res.data }
                                        ↑
                                   yahan h data
```

Toh `action.payload` = `res.data` — `fetchUser.payload` nahi. Isliye fulfilled k andar `action` parameter lena zaroori h —

```typescript
.addCase(fetchUser.fulfilled, (state, action) => {
  state.user = action.payload   // ← yahan se aaya
})
```

**Q: Normally payload mein data aata h jab dispatch karte h — par AsyncThunk mein middleware add karta h jab extraReducer mein call karta h?**

Bilkul sahi pakda —

Normal mein —

```
dispatch(increment(5))
        ↓
action = { type: "counter/increment", payload: 5 }
                                          ↑
                                  tune khud diya tha
```

Payload tune diya — dispatch ne seedha store bheja.

AsyncThunk mein —

```
dispatch(fetchUser())
        ↓
tune kuch payload nahi diya
        ↓
middleware ne async function chalaya
        ↓
return res.data   // tune return kiya
        ↓
middleware ne khud action banaya →
{ type: "auth/fetchUser/fulfilled", payload: res.data }
                                        ↑
                               middleware ne chipkaya
```

Fark yeh h —

```
Normal     → tune payload diya → dispatch ne bheja
AsyncThunk → middleware ne async function se jo return aaya
             woh khud payload mein chipka diya
```

Payload dono mein action k andar h — bas normal mein tune diya, AsyncThunk mein middleware ne chipkaya `return` value se.

**Q: rejectWithValue kya h?**

Normally jab API fail hoti h — axios error throw karta h. AsyncThunk us error ko khud pakad leta h aur `rejected` fire kar deta h. Lekin woh error `action.payload` mein nahi jaata — `action.error` mein jaata h.

```
API fail hui
      ↓
axios ne error throw kiya
      ↓
AsyncThunk ne khud pakda
      ↓
rejected fire kiya →
{ type: "auth/fetchUser/rejected", error: "..." }
                                      ↑
                                 payload nahi — error mein h
```

Toh `action.payload` undefined hoga — backend ka actual message nahi milega.

`rejectWithValue` ek function h jo middleware deta h — iska kaam h backend ka error `action.payload` mein daalna —

```typescript
const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/user/start");
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data); // ← backend ka error payload mein jaayega
    }
  },
);
```

```
API fail hui
      ↓
catch mein aaya
      ↓
rejectWithValue(error.response.data)
      ↓
rejected fire kiya →
{ type: "auth/fetchUser/rejected", payload: { message: "Invalid token" } }
                                       ↑
                                  ab payload mein h ✅
```

Bina rejectWithValue — action.payload undefined.
Saath rejectWithValue — action.payload mein backend ka actual error.

**Q: `(_, { rejectWithValue })` mein pehla wala `_` khaali kyun?**

Kyunki `fetchUser` mein tune koi argument pass nahi kiya —

```typescript
dispatch(fetchUser()); // ← kuch nahi diya
```

AsyncThunk ka pehla parameter hota h jo tune dispatch karte waqt diya ho — jaise `loginUser` mein —

```typescript
dispatch(loginUser({ email, password }));
//                 ↑
//            yeh pehla parameter hoga
```

Toh `loginUser` mein —

```typescript
async (credentials, { rejectWithValue }) => {
//      ↑
//   email, password yahan aayega
```

`fetchUser` mein kuch pass nahi kiya — toh pehla parameter khali `_` rakh diya. `_` ka matlab — "yahan kuch h lekin mujhe use nahi karna."

```
dispatch(fetchUser())        → _ = undefined  → _ ignore karo
dispatch(loginUser({...}))   → credentials = { email, password }  → use karo
```

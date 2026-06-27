// useForm() ek object return karta hai jisme ek INTERNAL STORE hota hai
// yeh store ek plain JS object hai jo saari field values apne paas rakhta hai
// { email: "", password: "" } — kuch aisa

const { register, handleSubmit, formState: { errors } } = useForm()

// ─────────────────────────────────────────────
// REGISTER — kya karta hai actually?
// ─────────────────────────────────────────────

// register("email") yeh ek object return karta hai:
// {
// name: "email", → input ka naam set karta hai
// ref: (domElement) => { ... }, → actual DOM input element ka reference leta hai
// onChange: (e) => { store.email = e.target.value }, → har keystroke pe internal store update karta hai
// onBlur: (e) => { ... } → field se bahar jaane pe validation trigger karta hai
// }

// jab tu likhta hai:
<input {...register("email")} />

// yeh exactly same hai jaise:
<input
name="email"
ref={internalRef} // RHF seedha DOM element ko pakad leta hai
onChange={(e) => {
internalStore["email"] = e.target.value // value store mein save hoti rehti hai
}}
onBlur={(e) => {
// validation check karo agar mode "onBlur" hai
}}
/>

// KEY POINT:
// RHF useState use NAHI karta internally
// woh seedha DOM ka ref pakadta hai aur values ek plain object mein rakhta hai
// isliye baar baar re-render nahi hota — performance better hoti hai

// ─────────────────────────────────────────────
// INTERNAL STORE — values kahan rehti hain?
// ─────────────────────────────────────────────

// useForm ke andar ek object hota hai — simple samjho:
// const internalStore = { email: "", password: "" }

// jab tu "abc@gmail.com" type karta hai email field mein:
// onChange fire hota hai → internalStore["email"] = "abc@gmail.com"

// jab tu "Test@1234" type karta hai password mein:
// onChange fire hota hai → internalStore["password"] = "Test@1234"

// ab store hai:
// { email: "abc@gmail.com", password: "Test@1234" }

// ─────────────────────────────────────────────
// HANDLESUBMIT — kaise kaam karta hai?
// ─────────────────────────────────────────────

// handleSubmit ek HIGHER ORDER FUNCTION hai
// matlab — yeh ek function hai jo TERA function leta hai aur ek NAYA function return karta hai

// tu likhta hai:

<form onSubmit={handleSubmit(onSubmit)}>

// yeh actually yeh ho raha hai:

<form onSubmit={
  (e) => {                              // browser ka default submit event aaya
    e.preventDefault()                  // page reload rokta hai

    const data = internalStore          // store se saari values uthata hai
    // { email: "abc@gmail.com", password: "Test@1234" }

    const isValid = runZodValidation(data)  // zodResolver se validate karta hai

    if (!isValid) {
      // errors object update karta hai
      // { email: { message: "Invalid email" } }
      // tera onSubmit NAHI chalta
      return
    }

    // sab theek hai toh
    onSubmit(data)  // TERA function chalta hai with full data

}
}>

// ─────────────────────────────────────────────
// TERA onSubmit — data kaise milta hai?
// ─────────────────────────────────────────────

const onSubmit = (data) => {
// RHF ne khud internalStore se data uthaya
// aur is function mein pass kar diya
console.log(data)
// { email: "abc@gmail.com", password: "Test@1234" }
}

// ─────────────────────────────────────────────
// POORA FLOW EK BAAR — step by step
// ─────────────────────────────────────────────

// STEP 1: Page load hota hai
// useForm() chalta hai → internalStore = { email: "", password: "" }

// STEP 2: User "abc@gmail.com" type karta hai
// register ka onChange fire hota hai
// internalStore = { email: "abc@gmail.com", password: "" }

// STEP 3: User "Test@1234" type karta hai
// register ka onChange fire hota hai
// internalStore = { email: "abc@gmail.com", password: "Test@1234" }

// STEP 4: User submit button dabata hai
// handleSubmit ka wrapper function chalta hai
// e.preventDefault() → page reload nahi hota

// STEP 5: Validation
// zodResolver internalStore ka data leke schema se compare karta hai
// email valid hai? password 8+ chars hai? uppercase hai?

// STEP 6a: Validation FAIL hua
// errors object update hota hai
// { password: { message: "Must Contain atleast one Special Character" } }
// onSubmit NAHI chalta
// UI pe errors dikhte hain

// STEP 6b: Validation PASS hua
// onSubmit(internalStore) chalta hai
// tu console mein data dekh sakta hai ya API call kar sakta hai

import { useMemo, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import {
  ArrowRight, Bike, CarFront, Check, CheckCircle2, ChevronRight,
  ClipboardCheck, CreditCard, ExternalLink, Info, LockKeyhole,
  MessageCircle, ShieldCheck, Smartphone, WalletCards
} from 'lucide-react'

const UPI_ID = '8554012976@kotakbank'
const BUSINESS_NAME = 'HSRP Booking'
const WHATSAPP_NUMBER = '918554012976'
const PRICES = { two: 699, four: 1099 }

const emptyForm = {
  ownerName: '',
  vehicleNumber: '',
  ChassisNumber: '',
  EngineNumber: '',
  mobile: '',
  pinCode: '',
  vehicleType: 'two',
  stateRto: '',
  officialReference: '',
  transactionId: '',
  notes: '',
}

function Field({ label, hint, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs leading-5 text-slate-500">{hint}</span>}
      {error && <span className="mt-1 block text-xs font-medium text-rose-600">{error}</span>}
    </label>
  )
}

function App() {
  const [form, setForm] = useState(emptyForm)
  const [step, setStep] = useState(1)
  const [paymentAcknowledged, setPaymentAcknowledged] = useState(false)
  const [errors, setErrors] = useState({})
  const [copied, setCopied] = useState(false)

  const amount = PRICES[form.vehicleType]
  const upiLink = useMemo(() => {
    const params = new URLSearchParams({
      pa: UPI_ID,
      pn: BUSINESS_NAME,
      am: String(amount),
      cu: 'INR',
      tn: `HSRP booking assistance - ${form.vehicleNumber || 'vehicle booking'}`,
    })
    return `upi://pay?${params.toString()}`
  }, [amount, form.vehicleNumber])

  const update = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setErrors(prev => ({ ...prev, [key]: '' }))
  }

  const validate = () => {
    const next = {}
    if (!form.ownerName.trim()) next.ownerName = 'Enter the vehicle owner’s full name.'
    if (!form.vehicleNumber.trim()) next.vehicleNumber = 'Enter the registration number.'
    if (!form.ChassisNumber.trim()) next.ChassisNumber = 'Enter the chassis number.'
    if (!form.EngineNumber.trim()) next.EngineNumber = 'Enter the engine number.'
    if (!form.pinCode.trim()) next.pinCode = 'Enter the pin code.'
    if (!/^[6-9]\d{9}$/.test(form.mobile.trim())) next.mobile = 'Enter a valid 10-digit Indian mobile number.'
    if (!form.stateRto.trim()) next.stateRto = 'Enter the state or RTO.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const continueToPayment = (event) => {
    event.preventDefault()
    if (!validate()) return
    setStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const copyUpi = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  const sendToWhatsApp = () => {
    if (!paymentAcknowledged) return
    const message = [
      `*${BUSINESS_NAME} — New booking assistance request*`,
      '',
      `Owner name: ${form.ownerName.trim()}`,
      `Vehicle type: ${form.vehicleType === 'two' ? 'Two-wheeler' : 'Four-wheeler'}`,
      `Registration number: ${form.vehicleNumber.trim().toUpperCase()}`,
      `Chassis number: ${form.ChassisNumber.trim().toUpperCase()}`,
      `Engine number: ${form.EngineNumber.trim().toUpperCase()}`,
      `Mobile number: ${form.mobile.trim()}`,
      `Pin code: ${form.pinCode.trim()}`,
      `State / RTO: ${form.stateRto.trim()}`,
      `Assistance fee: ₹${amount.toLocaleString('en-IN')}`,
      `UPI ID: ${UPI_ID}`,
      `Payment status: Customer says payment submitted — please verify in bank/UPI app`,
      `UPI transaction reference: ${form.transactionId.trim() || 'Not provided'}`,
      `Official booking reference: ${form.officialReference.trim() || 'Not provided'}`,
      `Additional notes: ${form.notes.trim() || 'None'}`,
      '',
      'Please verify the payment independently before confirming this request.',
    ].join('\n')
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }

  const reset = () => {
    setForm(emptyForm)
    setStep(1)
    setPaymentAcknowledged(false)
    setErrors({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <header className="relative overflow-hidden bg-navy-900 text-white">
        <div className="hero-glow pointer-events-none absolute inset-0" />
        <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <a href="#" className="flex items-center gap-3" aria-label="HSRP Booking home">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
              <ShieldCheck className="h-6 w-6 text-orange-400" />
            </span>
            <span>
              <span className="block text-base font-extrabold tracking-tight">HSRP Booking</span>
              <span className="block text-xs text-blue-100/70">Booking assistance</span>
            </span>
          </a>
          <a href="#booking" className="hidden items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-navy-900 transition hover:bg-orange-50 sm:inline-flex">
            Start booking <ArrowRight className="h-4 w-4" />
          </a>
        </nav>
        <div className="relative mx-auto grid max-w-6xl gap-9 px-4 pb-12 pt-5 sm:px-6 md:grid-cols-[1.2fr_.8fr] md:items-center md:pb-20 md:pt-12 lg:px-8">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-blue-50">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> Simple, guided assistance
            </div>
            <h1 className="max-w-2xl text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              HSRP booking help, <span className="text-orange-400">made simple.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-blue-100/80 sm:text-lg">
              Share your vehicle details, pay the disclosed assistance fee, and send your request to our team on WhatsApp.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 text-sm text-blue-50/90">
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> Clear fixed fees</span>
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> UPI payment</span>
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> WhatsApp handoff</span>
            </div>
          </div>
          <div className="mx-auto w-full max-w-sm">
            <div className="rounded-3xl border border-white/15 bg-white/[0.08] p-5 shadow-2xl backdrop-blur-sm sm:p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-blue-50">Assistance fee</span>
                <span className="rounded-full bg-emerald-300/15 px-2.5 py-1 text-xs font-bold text-emerald-200">Fixed pricing</span>
              </div>
              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-3 rounded-2xl bg-white p-4 text-slate-900">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600"><Bike className="h-6 w-6" /></span>
                  <div className="flex-1">
                    <p className="font-bold">Two-wheeler</p>
                    <p className="text-xs text-slate-500">Motorcycle / scooter</p>
                  </div>
                  <p className="text-xl font-black">₹699</p>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-white p-4 text-slate-900">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><CarFront className="h-6 w-6" /></span>
                  <div className="flex-1">
                    <p className="font-bold">Four-wheeler</p>
                    <p className="text-xs text-slate-500">Car / eligible vehicle</p>
                  </div>
                  <p className="text-xl font-black">₹1,099</p>
                </div>
              </div>
              <p className="mt-4 text-xs leading-5 text-blue-100/70">These are fees for this independent assistance service, not an official government HSRP price quote.</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section id="booking" className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
            <div className="border-b border-slate-100 px-5 py-5 sm:px-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.18em] text-orange-600">Booking request</p>
                  <h2 className="mt-1 text-2xl font-extrabold tracking-tight">{step === 1 ? 'Vehicle details' : 'Payment & submit'}</h2>
                  <p className="mt-1 text-sm text-slate-500">{step === 1 ? 'Tell us about the vehicle and its owner.' : 'Pay the assistance fee and prepare your WhatsApp request.'}</p>
                </div>
                <span className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">Step {step} of 2</span>
              </div>
              <div className="mt-5 flex gap-2">
                <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-orange-500' : 'bg-slate-100'}`} />
                <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-orange-500' : 'bg-slate-100'}`} />
              </div>
            </div>

            {step === 1 ? (
              <form onSubmit={continueToPayment} className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">1. Choose vehicle type</h3>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => update('vehicleType', 'two')} className={`select-card ${form.vehicleType === 'two' ? 'select-card-active' : ''}`}>
                      <span className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${form.vehicleType === 'two' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'}`}><Bike className="h-5 w-5" /></span>
                      <span className="block text-left text-sm font-bold">Two-wheeler</span>
                      <span className="mt-1 block text-left text-2xl font-black">₹699</span>
                      <span className="mt-1 block text-left text-xs text-slate-500">Assistance fee</span>
                      {form.vehicleType === 'two' && <Check className="absolute right-3 top-3 h-4 w-4 text-orange-600" />}
                    </button>
                    <button type="button" onClick={() => update('vehicleType', 'four')} className={`select-card ${form.vehicleType === 'four' ? 'select-card-active' : ''}`}>
                      <span className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${form.vehicleType === 'four' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'}`}><CarFront className="h-5 w-5" /></span>
                      <span className="block text-left text-sm font-bold">Four-wheeler</span>
                      <span className="mt-1 block text-left text-2xl font-black">₹1,099</span>
                      <span className="mt-1 block text-left text-xs text-slate-500">Assistance fee</span>
                      {form.vehicleType === 'four' && <Check className="absolute right-3 top-3 h-4 w-4 text-orange-600" />}
                    </button>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Vehicle owner's full name" error={errors.ownerName}>
                    <input className="field" autoComplete="name" placeholder="e.g. Rahul Sharma" value={form.ownerName} onChange={e => update('ownerName', e.target.value)} />
                  </Field>
                  <Field label="Vehicle registration number" hint="Enter as shown on the RC, e.g. MH 02 AB 1234." error={errors.vehicleNumber}>
                    <input className="field uppercase" autoCapitalize="characters" placeholder="MH 02 AB 1234" value={form.vehicleNumber} onChange={e => update('vehicleNumber', e.target.value.toUpperCase())} />
                  </Field>
                  <Field label="Chassis number" hint="Enter as shown on the RC." error={errors.ChassisNumber}>
                    <input className="field uppercase" autoCapitalize="characters" placeholder="Chassis number" value={form.ChassisNumber} onChange={e => update('ChassisNumber', e.target.value.toUpperCase())} />
                  </Field>
                  <Field label="Engine number" hint="Enter as shown on the RC." error={errors.EngineNumber}>
                    <input className="field uppercase" autoCapitalize="characters" placeholder="Engine number" value={form.EngineNumber} onChange={e => update('EngineNumber', e.target.value.toUpperCase())} />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2"> 
                  <Field label="Mobile number" hint="10-digit Indian mobile number." error={errors.mobile}>
                    <input className="field" inputMode="numeric" autoComplete="tel-national" maxLength={10} placeholder="98765 43210" value={form.mobile} onChange={e => update('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))} />
                  </Field>
                  <Field label="Pin code" hint="Enter the 6-digit pin code." error={errors.pinCode}>
                    <input className="field" inputMode="numeric" maxLength={6} placeholder="110001" value={form.pinCode} onChange={e => update('pinCode', e.target.value.replace(/\D/g, '').slice(0, 6))} />
                  </Field>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">   
                  <Field label="State / RTO" hint="For example, Maharashtra / MH-02." error={errors.stateRto}>
                    <input className="field" placeholder="State or RTO code" value={form.stateRto} onChange={e => update('stateRto', e.target.value)} />
                  </Field>
                </div>
                <Field label="Official booking reference (optional)" hint="Add this only if you have already started or completed a booking through the authorized channel.">
                  <input className="field" placeholder="Reference / application number" value={form.officialReference} onChange={e => update('officialReference', e.target.value)} />
                </Field>
                <Field label="Additional details (optional)">
                  <textarea className="field min-h-[88px] resize-y" placeholder="Anything we should know?" value={form.notes} onChange={e => update('notes', e.target.value)} />
                </Field>
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex gap-3">
                    <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                    <p className="text-xs leading-5 text-amber-900">Please enter only the information needed for assistance. Do not submit Aadhaar details, OTPs, UPI PINs, passwords, or card information.</p>
                  </div>
                </div>
                <button type="submit" className="primary-btn w-full">Continue to payment <ArrowRight className="h-4 w-4" /></button>
              </form>
            ) : (
              <div className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Booking summary</p>
                      <p className="mt-1 font-bold">{form.vehicleType === 'two' ? 'Two-wheeler' : 'Four-wheeler'} · {form.vehicleNumber.toUpperCase()}</p>
                      <p className="mt-1 text-sm text-slate-500">{form.ownerName} · {form.mobile}</p>
                    </div>
                    <button onClick={() => setStep(1)} className="text-sm font-bold text-blue-700 hover:underline">Edit</button>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
                    <span className="text-sm text-slate-600">Assistance fee</span>
                    <span className="text-2xl font-black">₹{amount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-100 text-orange-700"><WalletCards className="h-4 w-4" /></span>
                    <div>
                      <h3 className="font-bold">2. Pay with any UPI app</h3>
                      <p className="text-xs text-slate-500">Scan the QR code or open your UPI app.</p>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-5 rounded-2xl border border-slate-200 p-4 sm:grid-cols-[190px_1fr] sm:items-center sm:p-5">
                    <div className="mx-auto w-full max-w-[190px] rounded-2xl border border-slate-100 bg-white p-3">
                      <QRCodeSVG value={upiLink} size={164} level="M" includeMargin className="h-auto w-full" title={`UPI payment request for ₹${amount}`} />
                      <p className="mt-2 text-center text-xs font-bold text-slate-700">Pay ₹{amount.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold">Payee UPI ID</p>
                      <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <span className="min-w-0 flex-1 break-all text-sm font-semibold">{UPI_ID}</span>
                        <button onClick={copyUpi} className="shrink-0 rounded-lg bg-white px-3 py-2 text-xs font-bold text-blue-700 shadow-sm ring-1 ring-slate-200 hover:bg-blue-50">{copied ? 'Copied!' : 'Copy'}</button>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">Before paying, check the payee name and amount in your UPI app. The amount is a fee for the assistance service, not a government fee.</p>
                      <a href={upiLink} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50 sm:w-auto">
                        <Smartphone className="h-4 w-4" /> Open UPI app <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </div>

                <Field label="UPI transaction reference (optional)" hint="Enter the UTR / transaction ID after payment. This does not automatically verify payment.">
                  <input className="field" placeholder="Transaction ID / UTR" value={form.transactionId} onChange={e => update('transactionId', e.target.value)} />
                </Field>

                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-emerald-300">
                  <input type="checkbox" className="mt-1 h-4 w-4 accent-emerald-600" checked={paymentAcknowledged} onChange={e => setPaymentAcknowledged(e.target.checked)} />
                  <span>
                    <span className="block text-sm font-bold text-slate-800">I have submitted the UPI payment</span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">I understand the business must independently verify the payment before confirming my request.</span>
                  </span>
                </label>

                <button onClick={sendToWhatsApp} disabled={!paymentAcknowledged} className="whatsapp-btn w-full disabled:cursor-not-allowed disabled:opacity-40">
                  <MessageCircle className="h-5 w-5" /> Send booking details on WhatsApp <ChevronRight className="ml-auto h-4 w-4" />
                </button>
                {!paymentAcknowledged && <p className="text-center text-xs text-slate-500">Tick the payment acknowledgement to prepare your WhatsApp message.</p>}
                <button onClick={() => setStep(1)} className="w-full rounded-xl px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100">Back to vehicle details</button>
                <p className="text-xs leading-5 text-slate-500">WhatsApp opens with a prefilled message. Review it and tap Send in WhatsApp. This website does not automatically verify or record payments.</p>
              </div>
            )}
          </section>

          <aside className="space-y-4 lg:sticky lg:top-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
              <h3 className="font-extrabold">How it works</h3>
              <div className="mt-5 space-y-5">
                <div className="flex gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><ClipboardCheck className="h-4 w-4" /></span>
                  <div><p className="text-sm font-bold">Share vehicle details</p><p className="mt-1 text-xs leading-5 text-slate-500">Complete the short form with accurate RC details.</p></div>
                </div>
                <div className="flex gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-700"><CreditCard className="h-4 w-4" /></span>
                  <div><p className="text-sm font-bold">Pay the assistance fee</p><p className="mt-1 text-xs leading-5 text-slate-500">Scan the amount-specific UPI QR and keep your transaction reference.</p></div>
                </div>
                <div className="flex gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><MessageCircle className="h-4 w-4" /></span>
                  <div><p className="text-sm font-bold">Send on WhatsApp</p><p className="mt-1 text-xs leading-5 text-slate-500">Review the prefilled message and send it to the business.</p></div>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-blue-100 bg-blue-50 p-5">
              <div className="flex gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-800" />
                <div>
                  <h3 className="text-sm font-extrabold text-blue-950">Independent assistance service</h3>
                  <p className="mt-2 text-xs leading-5 text-blue-900/80">HSRP Booking is not a government website, RTO, or HSRP manufacturer. Customers must use the authorized booking channel applicable to their vehicle and state. This service fee is separate from official plate, fitment, or government charges.</p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5">
              <div className="flex gap-3">
                <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-slate-600" />
                <div>
                  <h3 className="text-sm font-bold">Payment safety</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">Never share your UPI PIN or OTP. Verify the payee and amount before approving payment.</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-xs leading-5 text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} HSRP Booking. Independent booking assistance.</p>
          <p>Not affiliated with any government department or HSRP manufacturer.</p>
        </div>
      </footer>
    </div>
  )
}

export default App

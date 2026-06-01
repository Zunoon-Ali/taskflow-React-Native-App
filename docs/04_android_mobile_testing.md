# 📲 Mobile Testing & Debugging Guide (Cable, Emulator & Scrcpy)

Yeh guide aapko batayegi ke aap apni React Native app ko real physical device (Android/iOS) par ya emulator par kaise test aur preview kar sakte hain.

---

## 🔌 Method 1: USB Cable ke zariye Real Android Mobile par run karna

Yeh tarika sabse best hai kyunki real phone par speed behtar milti hai aur PC par load nahi padta.

### Step 1: Mobile par Developer Options enable karein
1. Apne Android phone ki **Settings** open karein.
2. Sabse neeche ja kar **About Phone** (ya **System Info**) par tap karein.
3. **Build Number** (ya Software Version) option ko dhoondein.
4. **Build Number** par lagataar **7 baar tap karein**. Screen par message aayega: *"You are now a developer!"* (ho sakta hai aap se screen lock ka password maange).

### Step 2: USB Debugging toggle on karein
1. Wapas settings ke main page par jayein, wahan **Developer Options** (ya System > Developer Options) ka option aa chuka hoga.
2. Usko open karein aur **USB Debugging** ko dhoond kar **On (Enable)** kar dein.
3. (Optional but recommended): Kuch devices mein **Install via USB** ka option hota hai, usko bhi on kar dein.

### Step 3: PC se connect karein aur check karein
1. Mobile ko USB data cable ke zariye PC se connect karein.
2. Mobile ki screen par pop-up/prompt aayega: *"Allow USB Debugging?"*, is par check lagayein "Always allow from this computer" aur **OK/Allow** par tap karein.
3. Apne computer par Terminal (Command Prompt ya PowerShell) open karein aur type karein:
   ```bash
   adb devices
   ```
   **Output:** Agar setup theek hai, to list mein aapki device ka code aur safe word `device` likha dikhega, jaise:
   ```bash
   List of devices attached
   4df782c30982    device
   ```
   *Agar device unauthorized ya list empty hai, to USB debugging dobara off-on karein aur drivers reinstal karein.*

### Step 4: App Build aur Run karein
1. VS Code ke do terminals open karein.
2. Pehle terminal par Metro start karein:
   ```bash
   npm start
   ```
3. Dusre terminal par command run karein:
   ```bash
   npm run android
   ```
   *Pehli baar build hone mein 2-5 minutes lag sakte hain. Uske baad app automatically aapke mobile par open ho jayegi.*

---

## 💻 Method 2: Android Studio Emulator (Virtual Device) par run karna

Agar physical device na ho ya cable ka issue ho:

1. **Android Studio** open karein.
2. Welcome screen par ya main menu mein **More Actions** > **Virtual Device Manager** (ya AVD Manager) par click karein.
3. **Create Device** par click karein. Ek device select karein (e.g. Pixel 7) aur next karein.
4. Android system image download karein (API 34/35/33 standard recommended) aur virtual device create kar dein.
5. List mein se Play button (green icon) par click karke **Emulator run karein**.
6. Emulator launch hone ke baad simple project terminal par ye commands chalayein:
   ```bash
   npm start
   # Doosre tab mein:
   npm run android
   ```
   *React Native auto detect kar lega ke emulator active hai aur usme app install kar dega.*

---

## 🖥️ Mirror Mobile Screen to PC using Scrcpy (Screen Copy)

**scrcpy** ek free, open-source tool hai jiske zariye aap apne phone ki live screen ko apne PC/Laptop par window ki surat mein mirror kar sakte hain. Aap mouse ke click aur keypress se phone control kar sakte hain.

### Scrcpy setup karne ka tarika:
1. **Download:** [Scrcpy GitHub Releases](https://github.com/Genymobile/scrcpy) se Windows zip file download karein.
2. **Extract:** Zip file ko extract karke kisi safe folder mein rakh dein (e.g. `C:\scrcpy`).
3. **Run:** USB cable se phone connect karein (USB Debugging ON honi chahiye). Extract kiye gaye folder mein se `scrcpy.exe` par double click karein.
4. **Result:** Ek new window khulegi jisme aapke phone ki screen live show ho rahi hogi.
5. **VS Code Integration:** VS Code Extensions tab mein search karein **"scrcpy"**, isse install kar ke direct editor se run karne ke commands bhi mil jate hain.

---

## 🚨 Common Testing Errors & Solutions

> [!WARNING]
> **Error: "No devices found" / `adb` not recognized**
> - **Solution:** Android platform-tools folder path variable check karein. Windows environment variables ke path mein `C:\Users\<Username>\AppData\Local\Android\Sdk\platform-tools` zaroor hona chahiye.

> [!CAUTION]
> **Error: Gradle Build Failed / Out of Memory**
> - **Solution:** Agar memory low hai, to emulator band kar dein aur physical mobile use karein. `android` directory mein ja kar clean commands chalayein:
>   ```bash
   cd android
   ./gradlew clean
   cd ..
   npm run android
   ```

> [!NOTE]
> **App load nahi ho rahi, screen red/error flash kar rahi hai:**
> - Check karein ke aapka PC aur mobile **same Wi-Fi network** par connected hon.
> - Ya phir cable connection check karein, build successful hone ke baad device connect rehna zaroor hai.

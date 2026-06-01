# ⚖️ React (Web) vs React Native Syntax & Concepts Comparison

Agar aapko pehle se **React (Web)** aati hai, to React Native seekhna bohot aasan hai kyunki core concepts (jaise JSX, props, state, context, hooks) dono mein bilkul same hain. Lekin unka syntax, styling aur rendering environment alag hai.

Yeh guide aapko React (Web) aur React Native ke farq ko simple examples ke sath samjhayegi.

---

## 🆚 1. Markup / HTML Tags vs Native Components

React Web mein hum direct HTML tags (jaise `div`, `p`, `span`, `button`) use karte hain jo browser ka DOM render karta hai. React Native mein hum native primitives components use karte hain jo backend par actual Android aur iOS components mein convert hotes hain.

| React Web (HTML) | React Native (Component) | Detail / Purpose |
| :--- | :--- | :--- |
| `<div>` | `<View>` | Ek generic box ya container layout banane ke liye. |
| `<span>`, `<p>`, `<h1>` | `<Text>` | Ko bhi text likhne ke liye. React Native mein text zaroor `<Text>` tag ke andar hona chahiye warna compile error aayega. |
| `<button>` | `<TouchableOpacity>` or `<Pressable>` | Clickable links/buttons banane ke liye. `TouchableOpacity` click hone par button ko thoda transparent karta hai (fade effect). |
| `<img>` | `<Image>` | Local ya remote internet se images display karne ke liye. |
| `<input type="text">` | `<TextInput>` | Forms input handle karne ke liye. |
| `<ul>`, `<li>` | `<FlatList>` or `<ScrollView>` | Lists ko render karne ke liye. FlatList performant hoti hai kyunki ye sirf screen par dikhne wale items render karti hai (Lazy loading). |

---

## 🎨 2. Styling System (CSS vs StyleSheet)

React Native CSS support nahi karta, iski bajaye inline styles ya `StyleSheet.create` object use hota hai jo CSS ke properties ki tarah lagta hai lekin usme major limits aur farq hote hain.

```javascript
// React Web CSS Class
.card {
  background-color: #ffffff;
  padding: 16px;
  margin-top: 10px;
  border-radius: 8px;
}

// React Native StyleSheet style
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 16,               // No "px" unit! Sirf raw numbers use hote hain
    marginTop: 10,             // camelCase use hota hai (not margin-top)
    borderRadius: 8,
  }
});
```

### Key Differences in Styling:
1. **No Units:** React Native mein unit (jaise `px`, `em`, `rem`, `%`) nahi likha jata. Size values density-independent pixels (`dp`) hoti hain jo automatic har screen resolution par adjust hoti hain.
2. **CamelCase Keys:** CSS properties jaise `background-color`, `border-radius`, `font-size` ki jagah camelCase notation use hoti hai: `backgroundColor`, `borderRadius`, `fontSize`.
3. **No Cascading:** Styles default inherit nahi hote (jaise parent View ka text color setting, child Text ke color ko automatically change nahi karta). Aap ko har text element par specific style dena hoga.

---

## 📐 3. Flexbox Layout System

Dono layouts create karne ke liye Flexbox use karte hain lekin default settings alag hain:

| Property | React Web Default | React Native Default |
| :--- | :--- | :--- |
| **display** | block, inline, grid etc. | **flex** (Aap display grid ya block set nahi kar sakte) |
| **flexDirection** | **row** (elements left to right aate hain) | **column** (elements top to bottom aate hain) |
| **flex** | number or custom | `flex: 1` ka matlab hai: parent ki baaki bachi saari space occupy karna. |

---

## 🧭 4. Navigation (Routing)

* **React Web:** Router tags jaise `react-router-dom` (`BrowserRouter`, `Routes`, `Route`, `Link`) browser ke URL path (`/home`, `/profile`) par routes navigate karte hain.
* **React Native:** Mobile apps mein URL bar nahi hoti, isliye screens **Stack** ki tarah hoti hain (ek screen ke upar doosri screen aana). Isko handle karne ke liye `@react-navigation` library use ki jati hai.
  - **Concept:** Navigation push/pop state par chalti hai. `navigation.navigate('ScreenName')` aur `navigation.goBack()`.

---

## 🏗️ 5. Rendering & Execution Environment

* **React Web:** Code browser ke V8/Gecko engine mein chalta hai. Poora output DOM (Document Object Model) ke dynamic updates se screen par aata hai.
* **React Native:** Mobile device mein browser nahi hota. React Native JavaScript Engine (Hermes/JSC) ke zariye code run karta hai aur **Bridge** ke zariye Android OS ke native controls (jaise `android.widget.TextView`) ya iOS components (`UIView`) ke roop mein build karta hai. Isliye iska output hybrid web views nahi balki **100% Real Native App** hota hai!

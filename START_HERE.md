# 🎯 START HERE - Demo Testing

## ✅ Demo Environment Ready!

I've created a complete demo testing application for your Payment SDK!

---

## 🚀 Run Demo in 3 Commands

```bash
# 1. Fix npm permissions (if needed)
sudo chown -R $(whoami) ~/.npm

# 2. Install dependencies
cd /Users/sridhar/Desktop/payment-sdk/payment-sdk
npm install

# 3. Start demo
npm start
```

Demo opens at: **http://localhost:3000**

---

## 💳 Quick Test

1. **Set amount**: 5000 (= $50.00)
2. **Enter details**: Name and email
3. **Click**: "Start Payment Test"
4. **Use test card**: `4111 1111 1111 1111`
5. **CVV**: `123`, **Expiry**: `12/25`
6. **Submit** and see results! ✅

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| `QUICK_START_DEMO.md` | Detailed testing guide |
| `DEMO_TESTING.md` | Testing scenarios |
| `README.md` | Full SDK documentation |
| `USAGE_EXAMPLE.md` | Integration examples |

---

## 🎮 Demo Features

- ✨ Interactive payment configuration
- 💳 Real payment form with validation
- 🔒 Iframe security (same as production)
- ✅ Success/error handling
- 📱 Mobile responsive
- 🎨 Beautiful UI

---

## 🔧 Backend Configuration

**Optional**: If you have a backend API running:

Edit `src/config.js`:
```javascript
export const API_BASE_URL = 'http://localhost:8080/api/v1';
```

**Without backend**: Demo still works with mock data!

---

## 💡 Test Cards

| Card | Number |
|------|--------|
| Visa | `4111 1111 1111 1111` |
| Mastercard | `5555 5555 5555 4444` |
| Amex | `3782 822463 10005` |

All use CVV: `123` (or `1234` for Amex)

---

## ❓ Issues?

**Port 3000 in use?**
```bash
PORT=3001 npm start
```

**npm permission error?**
```bash
sudo chown -R $(whoami) ~/.npm
```

**Dependencies issue?**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📖 Next Steps

After testing the demo:

1. ✅ Test all scenarios (see `DEMO_TESTING.md`)
2. ✅ Check browser console for logs
3. ✅ Test on mobile devices
4. ✅ Review `USAGE_EXAMPLE.md` for integration
5. ✅ Connect to your backend API
6. ✅ Deploy to production

---

## 🎉 You're All Set!

Run `npm start` and start testing! 🚀

**Questions?** Check `QUICK_START_DEMO.md` for detailed instructions.


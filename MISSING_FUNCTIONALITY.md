# Missing Functionality & Non-Working Features

## 🔴 Non-Functional Links

### 1. **Profile Menu** (`components/profile-menu.component.tsx`)
- **Your profile** → Links to `#` (line 16)
- **Settings** → Links to `#` (line 17)
- **Status:** No profile or settings pages exist

### 2. **CTA Section** (`components/landing-page/cta-section.component.tsx`)
- **Get started button** → Links to `#` (line 16)
- **Learn more link** → Links to `#` (line 21)
- **Note:** Also has Lorem Ipsum content

### 3. **Contact Us Section** (`components/landing-page/contact-us.component.tsx`)
- **Support link** → Links to `#` (line 168)

### 4. **Pagination Component** (`components/pager.component.tsx`)
- **Previous/Next buttons** → Link to `#` when disabled (lines 29, 35)

## 🟡 TODO Items in Code

### 1. **Admin Offerings Page** (`pages/admin/offerings/index.tsx`)
- Missing error message rendering (lines 29, 305)
- Error states not properly handled

### 2. **Available Offerings Page** (`pages/available-offerings/index.tsx`)
- Missing error message rendering (line 34)

## 🟠 Missing Core Features

### 1. **User Profile Management**
- No profile page to view/edit user information
- No settings page for preferences
- No way to update email/password after registration

### 2. **Investment Features**
- No way to track investment history
- No portfolio dashboard
- No transaction history
- No document download center
- No investment performance tracking

### 3. **Communication Features**
- No messaging system
- No notification center
- No email preferences management

### 4. **Admin Features**
- Basic CRUD for offerings exists
- Missing: investor management, reporting, analytics

## 🔧 Quick Fixes Needed

### Immediate (Remove broken links):
```typescript
// Replace in profile-menu.component.tsx
const userNavigation = [
  {name: "Your profile", href: "/profile"},  // Need to create this page
  {name: "Settings", href: "/settings"}      // Need to create this page
];

// Or temporarily remove these menu items until pages are built
```

### CTA Section fixes:
```typescript
// Replace href="#" with actual routes:
href="/register"  // For "Get started"
href="/about"     // For "Learn more" (or remove)
```

## 📋 Implementation Priority

### Phase 1 - Critical
1. Create `/profile` page with basic user info display
2. Create `/settings` page with password change functionality
3. Fix all `href="#"` links to point to real pages or remove

### Phase 2 - Important
1. Add investment tracking dashboard
2. Add document management for offerings
3. Implement error handling for TODO items

### Phase 3 - Nice to Have
1. Notification system
2. Advanced analytics
3. Email preference center

## 🚨 Compliance Considerations

Missing features that may be required for investment platforms:
1. **Audit trail** - Track all user actions
2. **Document versioning** - Track offering document changes
3. **Accredited investor verification** - More robust verification
4. **Anti-money laundering (AML)** checks
5. **Know Your Customer (KYC)** documentation 
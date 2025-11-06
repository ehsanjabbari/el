// Accounting System JavaScript
class AccountingSystem {
    constructor() {
        this.data = {
            products: [],
            inputInvoices: [],
            salesInvoices: [],
            settings: {
                theme: 'dark',
                githubToken: '',
                repoName: '',
                fileName: 'accounting-data.json'
            }
        };
        
        this.currentTab = 'inputInvoices';
        this.init();
    }

    init() {
        this.loadData();
        this.bindEvents();
        this.renderCurrentTab();
        this.setupTheme();
        this.setupPersianDateInputs();
    }

    // Data Management
    loadData() {
        const savedData = localStorage.getItem('accountingSystemData');
        if (savedData) {
            try {
                this.data = JSON.parse(savedData);
            } catch (e) {
                console.error('Error loading data:', e);
                this.showToast('خطا در بارگذاری اطلاعات', 'error');
            }
        }
    }

    saveData() {
        try {
            localStorage.setItem('accountingSystemData', JSON.stringify(this.data));
            this.showToast('اطلاعات با موفقیت ذخیره شد', 'success');
        } catch (e) {
            console.error('Error saving data:', e);
            this.showToast('خطا در ذخیره اطلاعات', 'error');
        }
    }

    // Event Binding
    bindEvents() {
        // Tab navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.switchTab(e.target.closest('.nav-item').dataset.tab);
            });
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Floating action button
        document.getElementById('fab').addEventListener('click', () => {
            this.showAddModal();
        });

        // Add buttons
        document.getElementById('addInputInvoice').addEventListener('click', () => {
            this.showAddInputInvoiceModal();
        });

        document.getElementById('addSalesInvoice').addEventListener('click', () => {
            this.showAddSalesInvoiceModal();
        });

        document.getElementById('manageInventory').addEventListener('click', () => {
            this.showManageInventoryModal();
        });

        // Reports
        document.getElementById('generateReport').addEventListener('click', () => {
            this.generateReport();
        });

        // Backup functions
        document.getElementById('exportData').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('importData').addEventListener('click', () => {
            document.getElementById('importFile').click();
        });

        document.getElementById('importFile').addEventListener('change', (e) => {
            this.importData(e);
        });

        document.getElementById('syncToGitHub').addEventListener('click', () => {
            this.syncToGitHub();
        });

        document.getElementById('syncFromGitHub').addEventListener('click', () => {
            this.syncFromGitHub();
        });

        // Modal events
        document.getElementById('modalClose').addEventListener('click', () => {
            this.hideModal();
        });

        document.getElementById('modalOverlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.hideModal();
            }
        });

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideModal();
            }
        });
    }

    // Tab Management
    switchTab(tabName) {
        // Update nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        this.currentTab = tabName;
        this.renderCurrentTab();
    }

    renderCurrentTab() {
        switch (this.currentTab) {
            case 'inputInvoices':
                this.renderInputInvoices();
                break;
            case 'salesInvoices':
                this.renderSalesInvoices();
                break;
            case 'inventory':
                this.renderInventory();
                break;
            case 'reports':
                this.renderReports();
                break;
            case 'backup':
                this.renderBackup();
                break;
        }
    }

    // Persian Date Functions
    setupPersianDateInputs() {
        const today = new Date();
        const persianDate = this.getPersianDate(today);
        
        // Set today's date as default for input fields
        const dateInputs = document.querySelectorAll('input[type="date"]');
        dateInputs.forEach(input => {
            input.valueAsDate = today;
        });
    }

    getPersianDate(date) {
        const jalali = this.toJalali(date.getFullYear(), date.getMonth() + 1, date.getDate());
        return `${jalali.year}/${jalali.month.toString().padStart(2, '0')}/${jalali.day.toString().padStart(2, '0')}`;
    }

    getPersianDateLong(date) {
        const jalali = this.toJalali(date.getFullYear(), date.getMonth() + 1, date.getDate());
        const dayNames = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];
        const monthNames = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
        
        return `${dayNames[jalali.weekday]} ${jalali.day} ${monthNames[jalali.month - 1]} ${jalali.year}`;
    }

    toJalali(gy, gm, gd) {
        // Persian calendar conversion algorithm
        const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        const j = [0, 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
        const DaysOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        
        if (gy > 1600) {
            var gy2 = gy - 1600;
            var gm2 = gm - 1;
            var gd2 = gd - 1;
            
            var jy1 = 979;
            var jy2 = gy2 - 1;
            var jm1, jm2;
            
            if (gy2 >= 365 && gy2 <= 365 * 3 || Math.floor(gy2 / 4) === Math.floor(gy2 / 4) && gy2 % 100 != 0) {
                DaysOfMonth[1] = 29;
            } else {
                DaysOfMonth[1] = 28;
            }
            
            if (gm2 >= 2) {
                jm2 = DaysOfMonth[1];
                var jy2 = Math.floor(gy2);
            }
            
            var jd = jy1 + Math.floor(jy2 / 4) * 1461 + j[gm2] + gd2 - 1;
            var jf = jd % 1461;
            jy2 = Math.floor(jf / 365);
            if (jf >= 365) {
                jf = jf - Math.floor(jy2 / 4) * 1461;
            }
            
            if (jf >= 365) {
                jy2++;
            }
            
            var m2 = 0;
            while (m2 < 12 && j[gm2] < jf) {
                m2++;
            }
            
            jm1 = m2;
            gd2 = jf - j[jm1];
            var arr = [jy1 + jy2, jm1, gd2];
            return { year: arr[0], month: arr[1], day: arr[2], weekday: (jd + 1) % 7 };
        }
    }

    // Product Management
    addProduct(name, purchasePrice) {
        const product = {
            id: Date.now().toString(),
            name: name.trim(),
            purchasePrice: parseFloat(purchasePrice),
            createdAt: new Date().toISOString()
        };
        
        this.data.products.push(product);
        this.saveData();
        return product;
    }

    getProductById(id) {
        return this.data.products.find(p => p.id === id);
    }

    getAllProducts() {
        return this.data.products;
    }

    // Invoice Management
    addInputInvoice(products, date, totalAmount) {
        const invoice = {
            id: Date.now().toString(),
            date: date,
            products: products,
            totalAmount: totalAmount,
            createdAt: new Date().toISOString()
        };
        
        this.data.inputInvoices.push(invoice);
        this.saveData();
        return invoice;
    }

    addSalesInvoice(products, date, totalAmount, totalProfit) {
        const invoice = {
            id: Date.now().toString(),
            date: date,
            products: products,
            totalAmount: totalAmount,
            totalProfit: totalProfit,
            createdAt: new Date().toISOString()
        };
        
        this.data.salesInvoices.push(invoice);
        this.saveData();
        return invoice;
    }

    // Inventory Management
    getInventory() {
        const inventory = {};
        
        // Calculate input quantities
        this.data.inputInvoices.forEach(invoice => {
            invoice.products.forEach(item => {
                if (!inventory[item.productId]) {
                    inventory[item.productId] = {
                        product: this.getProductById(item.productId),
                        totalInput: 0,
                        totalOutput: 0,
                        currentStock: 0
                    };
                }
                inventory[item.productId].totalInput += item.quantity;
            });
        });

        // Calculate output quantities
        this.data.salesInvoices.forEach(invoice => {
            invoice.products.forEach(item => {
                if (!inventory[item.productId]) {
                    inventory[item.productId] = {
                        product: this.getProductById(item.productId),
                        totalInput: 0,
                        totalOutput: 0,
                        currentStock: 0
                    };
                }
                inventory[item.productId].totalOutput += item.quantity;
            });
        });

        // Calculate current stock
        Object.keys(inventory).forEach(productId => {
            inventory[productId].currentStock = 
                inventory[productId].totalInput - inventory[productId].totalOutput;
        });

        return inventory;
    }

    // Rendering Functions
    renderInputInvoices() {
        const container = document.getElementById('inputInvoicesList');
        
        if (this.data.inputInvoices.length === 0) {
            container.innerHTML = this.getEmptyStateHTML('فاکتور ورودی', 'هنوز هیچ فاکتور ورودی ثبت نشده است');
            return;
        }

        const sortedInvoices = this.data.inputInvoices
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map(invoice => {
                const date = new Date(invoice.date);
                return `
                    <div class="item-card" onclick="app.showInvoiceDetails('input', '${invoice.id}')">
                        <div class="item-card-header">
                            <h3 class="item-title">فاکتور ${invoice.id.slice(-6)}</h3>
                            <span class="item-amount">${this.formatCurrency(invoice.totalAmount)}</span>
                        </div>
                        <div class="item-subtitle">
                            <span>${this.getPersianDateLong(date)}</span>
                            <span class="item-status">${invoice.products.length} محصول</span>
                        </div>
                    </div>
                `;
            }).join('');

        container.innerHTML = sortedInvoices;
    }

    renderSalesInvoices() {
        const container = document.getElementById('salesInvoicesList');
        
        if (this.data.salesInvoices.length === 0) {
            container.innerHTML = this.getEmptyStateHTML('فاکتور فروش', 'هنوز هیچ فاکتور فروش ثبت نشده است');
            return;
        }

        const sortedInvoices = this.data.salesInvoices
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map(invoice => {
                const date = new Date(invoice.date);
                const profitStatus = invoice.totalProfit >= 0 ? 'profit' : 'loss';
                const profitText = invoice.totalProfit >= 0 ? 'سود' : 'زیان';
                return `
                    <div class="item-card" onclick="app.showInvoiceDetails('sales', '${invoice.id}')">
                        <div class="item-card-header">
                            <h3 class="item-title">فاکتور ${invoice.id.slice(-6)}</h3>
                            <span class="item-amount">${this.formatCurrency(invoice.totalAmount)}</span>
                        </div>
                        <div class="item-subtitle">
                            <span>${this.getPersianDateLong(date)}</span>
                            <span class="item-status ${profitStatus}">${profitText}: ${this.formatCurrency(invoice.totalProfit)}</span>
                        </div>
                    </div>
                `;
            }).join('');

        container.innerHTML = sortedInvoices;
    }

    renderInventory() {
        const container = document.getElementById('inventoryList');
        const inventory = this.getInventory();
        
        if (Object.keys(inventory).length === 0) {
            container.innerHTML = this.getEmptyStateHTML('موجودی انبار', 'هنوز هیچ محصولی در انبار موجود نیست');
            return;
        }

        const inventoryItems = Object.values(inventory)
            .sort((a, b) => a.product.name.localeCompare(b.product.name, 'fa'))
            .map(item => {
                const stockStatus = item.currentStock > 0 ? 'profit' : 
                                  item.currentStock === 0 ? 'warning' : 'loss';
                const stockText = item.currentStock > 0 ? 'موجود' : 
                                item.currentStock === 0 ? 'تمام شد' : 'کسری';
                return `
                    <div class="item-card" onclick="app.showProductDetails('${item.product.id}')">
                        <div class="item-card-header">
                            <h3 class="item-title">${item.product.name}</h3>
                            <span class="item-amount">${this.formatCurrency(item.product.purchasePrice)}</span>
                        </div>
                        <div class="item-subtitle">
                            <span>ورود: ${item.totalInput} | خروج: ${item.totalOutput}</span>
                            <span class="item-status ${stockStatus}">${stockText}: ${item.currentStock}</span>
                        </div>
                    </div>
                `;
            }).join('');

        container.innerHTML = inventoryItems;
    }

    renderReports() {
        // This will be updated when generateReport is called
        document.getElementById('reportResults').innerHTML = 
            '<div class="empty-state"><p>برای مشاهده گزارش، بازه زمانی مورد نظر را انتخاب کنید</p></div>';
    }

    renderBackup() {
        // Load saved settings
        document.getElementById('githubToken').value = this.data.settings.githubToken || '';
        document.getElementById('repoName').value = this.data.settings.repoName || '';
        document.getElementById('fileName').value = this.data.settings.fileName || 'accounting-data.json';
    }

    // Modal Functions
    showAddModal() {
        const modal = document.getElementById('modalOverlay');
        const title = document.getElementById('modalTitle');
        const content = document.getElementById('modalContent');
        
        title.textContent = 'انتخاب عملیات';
        
        content.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: var(--space-md);">
                <button class="btn-primary" onclick="app.showAddInputInvoiceModal(); app.hideModal();" style="justify-content: flex-start;">
                    <i class="fas fa-file-import"></i>
                    ثبت فاکتور ورودی جدید
                </button>
                <button class="btn-primary" onclick="app.showAddSalesInvoiceModal(); app.hideModal();" style="justify-content: flex-start;">
                    <i class="fas fa-file-export"></i>
                    ثبت فاکتور فروش جدید
                </button>
                <button class="btn-secondary" onclick="app.showManageInventoryModal(); app.hideModal();" style="justify-content: flex-start;">
                    <i class="fas fa-plus"></i>
                    افزودن محصول جدید
                </button>
            </div>
        `;
        
        modal.classList.add('active');
    }

    showAddInputInvoiceModal() {
        const modal = document.getElementById('modalOverlay');
        const title = document.getElementById('modalTitle');
        const content = document.getElementById('modalContent');
        
        title.textContent = 'فاکتور ورودی جدید';
        
        const products = this.getAllProducts();
        const productsOptions = products.length > 0 
            ? products.map(p => `<option value="${p.id}">${p.name} - ${this.formatCurrency(p.purchasePrice)}</option>`).join('')
            : '<option value="">هنوز محصولی ثبت نشده است</option>';
        
        content.innerHTML = `
            <form id="inputInvoiceForm">
                <div class="input-group">
                    <label>تاریخ</label>
                    <input type="date" name="date" required>
                </div>
                <div class="input-group">
                    <label>محصول</label>
                    <select name="productId" onchange="app.onProductSelect(this)" required>
                        <option value="">انتخاب کنید</option>
                        ${productsOptions}
                    </select>
                </div>
                <div id="newProductFields" style="display: none;">
                    <div class="input-group">
                        <label>نام محصول جدید</label>
                        <input type="text" name="newProductName" placeholder="نام محصول">
                    </div>
                    <div class="input-group">
                        <label>قیمت خرید</label>
                        <input type="number" name="newProductPrice" placeholder="قیمت خرید" step="0.01">
                    </div>
                </div>
                <div class="input-group">
                    <label>تعداد</label>
                    <input type="number" name="quantity" min="1" value="1" required>
                </div>
                <div class="input-group">
                    <label>قیمت واحد</label>
                    <input type="number" name="unitPrice" step="0.01" required>
                </div>
                <div class="input-group">
                    <label>توضیحات (اختیاری)</label>
                    <textarea name="description" rows="3" placeholder="توضیحات اضافی"></textarea>
                </div>
                <div style="display: flex; gap: var(--space-sm); margin-top: var(--space-lg);">
                    <button type="submit" class="btn-primary" style="flex: 1;">ثبت فاکتور</button>
                    <button type="button" class="btn-secondary" onclick="app.hideModal()" style="flex: 1;">انصراف</button>
                </div>
            </form>
        `;
        
        modal.classList.add('active');
        
        // Set today's date
        const dateInput = content.querySelector('input[name="date"]');
        dateInput.valueAsDate = new Date();
        
        // Set up form submission
        content.querySelector('#inputInvoiceForm').addEventListener('submit', (e) => {
            this.handleInputInvoiceSubmit(e);
        });
    }

    showAddSalesInvoiceModal() {
        const modal = document.getElementById('modalOverlay');
        const title = document.getElementById('modalTitle');
        const content = document.getElementById('modalContent');
        
        title.textContent = 'فاکتور فروش جدید';
        
        const inventory = this.getInventory();
        const availableProducts = Object.values(inventory).filter(item => item.currentStock > 0);
        
        if (availableProducts.length === 0) {
            content.innerHTML = `
                <div class="empty-state">
                    <p>هنوز محصولی برای فروش موجود نیست</p>
                    <button class="btn-primary" onclick="app.hideModal(); app.switchTab('inputInvoices');" style="margin-top: var(--space-md);">
                        ثبت فاکتور ورودی
                    </button>
                </div>
            `;
            modal.classList.add('active');
            return;
        }
        
        const productsOptions = availableProducts.map(item => 
            `<option value="${item.product.id}">${item.product.name} - موجودی: ${item.currentStock} - خرید: ${this.formatCurrency(item.product.purchasePrice)}</option>`
        ).join('');
        
        content.innerHTML = `
            <form id="salesInvoiceForm">
                <div class="input-group">
                    <label>تاریخ</label>
                    <input type="date" name="date" required>
                </div>
                <div class="input-group">
                    <label>محصول</label>
                    <select name="productId" onchange="app.onSalesProductSelect(this)" required>
                        <option value="">انتخاب کنید</option>
                        ${productsOptions}
                    </select>
                </div>
                <div class="input-group">
                    <label>تعداد قابل فروش</label>
                    <input type="number" name="maxQuantity" readonly>
                </div>
                <div class="input-group">
                    <label>تعداد</label>
                    <input type="number" name="quantity" min="1" required>
                </div>
                <div class="input-group">
                    <label>قیمت فروش</label>
                    <input type="number" name="sellingPrice" step="0.01" required>
                </div>
                <div class="input-group">
                    <label>توضیحات (اختیاری)</label>
                    <textarea name="description" rows="3" placeholder="توضیحات اضافی"></textarea>
                </div>
                <div style="display: flex; gap: var(--space-sm); margin-top: var(--space-lg);">
                    <button type="submit" class="btn-primary" style="flex: 1;">ثبت فاکتور</button>
                    <button type="button" class="btn-secondary" onclick="app.hideModal()" style="flex: 1;">انصراف</button>
                </div>
            </form>
        `;
        
        modal.classList.add('active');
        
        // Set today's date
        const dateInput = content.querySelector('input[name="date"]');
        dateInput.valueAsDate = new Date();
        
        // Set up form submission
        content.querySelector('#salesInvoiceForm').addEventListener('submit', (e) => {
            this.handleSalesInvoiceSubmit(e);
        });
    }

    showManageInventoryModal() {
        const modal = document.getElementById('modalOverlay');
        const title = document.getElementById('modalTitle');
        const content = document.getElementById('modalContent');
        
        title.textContent = 'مدیریت محصولات';
        
        const products = this.getAllProducts();
        
        if (products.length === 0) {
            content.innerHTML = `
                <form id="addProductForm">
                    <h4>افزودن محصول جدید</h4>
                    <div class="input-group">
                        <label>نام محصول</label>
                        <input type="text" name="name" required>
                    </div>
                    <div class="input-group">
                        <label>قیمت خرید</label>
                        <input type="number" name="price" step="0.01" required>
                    </div>
                    <div style="display: flex; gap: var(--space-sm); margin-top: var(--space-lg);">
                        <button type="submit" class="btn-primary" style="flex: 1;">افزودن</button>
                        <button type="button" class="btn-secondary" onclick="app.hideModal()" style="flex: 1;">انصراف</button>
                    </div>
                </form>
            `;
            
            content.querySelector('#addProductForm').addEventListener('submit', (e) => {
                this.handleAddProductSubmit(e);
            });
        } else {
            const productsList = products.map(product => `
                <div class="item-card" style="margin-bottom: var(--space-sm);">
                    <div class="item-card-header">
                        <h3 class="item-title">${product.name}</h3>
                        <span class="item-amount">${this.formatCurrency(product.purchasePrice)}</span>
                    </div>
                    <div class="item-subtitle">
                        <span>تاریخ ثبت: ${this.getPersianDateLong(new Date(product.createdAt))}</span>
                        <button class="btn-secondary" onclick="app.editProduct('${product.id}')" style="font-size: 12px; padding: 4px 8px;">
                            ویرایش
                        </button>
                    </div>
                </div>
            `).join('');
            
            content.innerHTML = `
                <div style="max-height: 400px; overflow-y: auto; margin-bottom: var(--space-lg);">
                    <h4 style="margin-bottom: var(--space-md);">محصولات موجود</h4>
                    ${productsList}
                </div>
                <div style="border-top: 1px solid var(--border-subtle); padding-top: var(--space-lg);">
                    <h4>افزودن محصول جدید</h4>
                    <form id="addProductForm">
                        <div class="input-group">
                            <label>نام محصول</label>
                            <input type="text" name="name" required>
                        </div>
                        <div class="input-group">
                            <label>قیمت خرید</label>
                            <input type="number" name="price" step="0.01" required>
                        </div>
                        <div style="display: flex; gap: var(--space-sm); margin-top: var(--space-lg);">
                            <button type="submit" class="btn-primary" style="flex: 1;">افزودن</button>
                            <button type="button" class="btn-secondary" onclick="app.hideModal()" style="flex: 1;">بستن</button>
                        </div>
                    </form>
                </div>
            `;
            
            content.querySelector('#addProductForm').addEventListener('submit', (e) => {
                this.handleAddProductSubmit(e);
            });
        }
        
        modal.classList.add('active');
    }

    // Form Handlers
    handleInputInvoiceSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const date = formData.get('date');
        const productId = formData.get('productId');
        const quantity = parseInt(formData.get('quantity'));
        const unitPrice = parseFloat(formData.get('unitPrice'));
        const description = formData.get('description');
        
        let product;
        
        if (productId) {
            // Existing product
            product = this.getProductById(productId);
        } else {
            // New product
            const newProductName = formData.get('newProductName');
            const newProductPrice = parseFloat(formData.get('newProductPrice'));
            
            if (!newProductName || !newProductPrice) {
                this.showToast('لطفاً تمام فیلدهای محصول جدید را پر کنید', 'error');
                return;
            }
            
            product = this.addProduct(newProductName, newProductPrice);
        }
        
        const totalAmount = quantity * unitPrice;
        
        const invoice = this.addInputInvoice([{
            productId: product.id,
            productName: product.name,
            quantity: quantity,
            unitPrice: unitPrice,
            totalPrice: totalAmount,
            description: description
        }], date, totalAmount);
        
        this.hideModal();
        this.renderInputInvoices();
        this.showToast('فاکتور ورودی با موفقیت ثبت شد', 'success');
    }

    handleSalesInvoiceSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const date = formData.get('date');
        const productId = formData.get('productId');
        const quantity = parseInt(formData.get('quantity'));
        const sellingPrice = parseFloat(formData.get('sellingPrice'));
        const description = formData.get('description');
        
        const inventory = this.getInventory();
        const availableProduct = inventory[productId];
        
        if (!availableProduct || availableProduct.currentStock < quantity) {
            this.showToast('تعداد درخواستی موجود نیست', 'error');
            return;
        }
        
        const product = availableProduct.product;
        const totalAmount = quantity * sellingPrice;
        const totalProfit = quantity * (sellingPrice - product.purchasePrice);
        
        const invoice = this.addSalesInvoice([{
            productId: product.id,
            productName: product.name,
            quantity: quantity,
            purchasePrice: product.purchasePrice,
            sellingPrice: sellingPrice,
            totalPrice: totalAmount,
            profit: totalProfit,
            description: description
        }], date, totalAmount, totalProfit);
        
        this.hideModal();
        this.renderSalesInvoices();
        this.renderInventory(); // Update inventory display
        this.showToast('فاکتور فروش با موفقیت ثبت شد', 'success');
    }

    handleAddProductSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const name = formData.get('name');
        const price = parseFloat(formData.get('price'));
        
        this.addProduct(name, price);
        e.target.reset();
        this.showToast('محصول با موفقیت اضافه شد', 'success');
        
        // Refresh the products list if modal is still open
        if (document.getElementById('modalOverlay').classList.contains('active')) {
            this.showManageInventoryModal();
        }
    }

    // Product Selection Handlers
    onProductSelect(select) {
        const newProductFields = document.getElementById('newProductFields');
        const unitPriceField = document.querySelector('input[name="unitPrice"]');
        const quantityField = document.querySelector('input[name="quantity"]');
        
        if (select.value === 'new') {
            newProductFields.style.display = 'block';
            unitPriceField.value = '';
        } else {
            newProductFields.style.display = 'none';
            if (select.value) {
                const product = this.getProductById(select.value);
                unitPriceField.value = product.purchasePrice;
            }
        }
    }

    onSalesProductSelect(select) {
        const quantityField = document.querySelector('input[name="quantity"]');
        const maxQuantityField = document.querySelector('input[name="maxQuantity"]');
        const sellingPriceField = document.querySelector('input[name="sellingPrice"]');
        
        if (select.value) {
            const inventory = this.getInventory();
            const availableProduct = inventory[select.value];
            if (availableProduct) {
                maxQuantityField.value = availableProduct.currentStock;
                quantityField.max = availableProduct.currentStock;
                quantityField.value = 1;
                sellingPriceField.value = availableProduct.product.purchasePrice;
            }
        }
    }

    // Report Generation
    generateReport() {
        const fromDate = document.getElementById('fromDate').value;
        const toDate = document.getElementById('toDate').value;
        
        if (!fromDate || !toDate) {
            this.showToast('لطفاً بازه زمانی را انتخاب کنید', 'error');
            return;
        }
        
        const from = new Date(fromDate);
        const to = new Date(toDate);
        
        // Filter sales invoices in the date range
        const relevantInvoices = this.data.salesInvoices.filter(invoice => {
            const invoiceDate = new Date(invoice.date);
            return invoiceDate >= from && invoiceDate <= to;
        });
        
        const totalSales = relevantInvoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);
        const totalProfit = relevantInvoices.reduce((sum, invoice) => sum + invoice.totalProfit, 0);
        const totalInvoices = relevantInvoices.length;
        
        // Product-wise breakdown
        const productStats = {};
        relevantInvoices.forEach(invoice => {
            invoice.products.forEach(item => {
                if (!productStats[item.productId]) {
                    productStats[item.productId] = {
                        name: item.productName,
                        quantity: 0,
                        revenue: 0,
                        profit: 0
                    };
                }
                productStats[item.productId].quantity += item.quantity;
                productStats[item.productId].revenue += item.totalPrice;
                productStats[item.productId].profit += item.profit;
            });
        });
        
        // Render report
        const container = document.getElementById('reportResults');
        const statsHTML = `
            <div class="report-stats">
                <div class="stat-card">
                    <div class="stat-value">${totalInvoices}</div>
                    <div class="stat-label">تعداد فاکتور</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${this.formatCurrency(totalSales)}</div>
                    <div class="stat-label">مجموع فروش</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" style="color: ${totalProfit >= 0 ? 'var(--success)' : 'var(--error)'}">
                        ${this.formatCurrency(totalProfit)}
                    </div>
                    <div class="stat-label">مجموع سود</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${Object.keys(productStats).length}</div>
                    <div class="stat-label">محصولات فروخته شده</div>
                </div>
            </div>
        `;
        
        const productsHTML = Object.values(productStats)
            .sort((a, b) => b.profit - a.profit)
            .map(item => `
                <div class="item-card" style="margin-bottom: var(--space-sm);">
                    <div class="item-card-header">
                        <h3 class="item-title">${item.name}</h3>
                        <span class="item-amount">${this.formatCurrency(item.profit)}</span>
                    </div>
                    <div class="item-subtitle">
                        <span>فروش: ${item.quantity} عدد | درآمد: ${this.formatCurrency(item.revenue)}</span>
                    </div>
                </div>
            `).join('');
        
        container.innerHTML = statsHTML + `
            <h4>جزئیات محصولات</h4>
            <div class="content-list">
                ${productsHTML}
            </div>
        `;
        
        this.showToast('گزارش با موفقیت تهیه شد', 'success');
    }

    // Backup Functions
    exportData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `accounting-backup-${this.getPersianDate(new Date())}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showToast('بک‌آپ با موفقیت دانلود شد', 'success');
    }

    importData(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedData = JSON.parse(event.target.result);
                
                // Validate data structure
                if (!importedData.products || !importedData.inputInvoices || !importedData.salesInvoices) {
                    throw new Error('فرمت فایل نامعتبر است');
                }
                
                this.data = importedData;
                this.saveData();
                this.renderCurrentTab();
                this.showToast('اطلاعات با موفقیت وارد شد', 'success');
            } catch (error) {
                this.showToast('خطا در خواندن فایل: ' + error.message, 'error');
            }
        };
        reader.readAsText(file);
        
        // Reset file input
        e.target.value = '';
    }

    async syncToGitHub() {
        const token = document.getElementById('githubToken').value;
        const repoName = document.getElementById('repoName').value;
        const fileName = document.getElementById('fileName').value;
        
        if (!token || !repoName || !fileName) {
            this.showToast('لطفاً تمام فیلدهای GitHub را پر کنید', 'error');
            return;
        }
        
        try {
            // Save settings
            this.data.settings.githubToken = token;
            this.data.settings.repoName = repoName;
            this.data.settings.fileName = fileName;
            this.saveData();
            
            const content = btoa(JSON.stringify(this.data, null, 2));
            const apiUrl = `https://api.github.com/repos/${token.split('-')[0]}/${repoName}/contents/${fileName}`;
            
            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: `Update accounting data - ${this.getPersianDate(new Date())}`,
                    content: content
                })
            });
            
            if (!response.ok) {
                throw new Error('خطا در ارسال به GitHub');
            }
            
            this.showToast('اطلاعات با موفقیت به GitHub ارسال شد', 'success');
        } catch (error) {
            this.showToast('خطا در همگام‌سازی: ' + error.message, 'error');
        }
    }

    async syncFromGitHub() {
        const token = document.getElementById('githubToken').value;
        const repoName = document.getElementById('repoName').value;
        const fileName = document.getElementById('fileName').value;
        
        if (!token || !repoName || !fileName) {
            this.showToast('لطفاً تمام فیلدهای GitHub را پر کنید', 'error');
            return;
        }
        
        try {
            const apiUrl = `https://api.github.com/repos/${token.split('-')[0]}/${repoName}/contents/${fileName}`;
            
            const response = await fetch(apiUrl, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('خطا در دریافت از GitHub');
            }
            
            const data = await response.json();
            const decodedContent = atob(data.content);
            const importedData = JSON.parse(decodedContent);
            
            // Validate data structure
            if (!importedData.products || !importedData.inputInvoices || !importedData.salesInvoices) {
                throw new Error('فرمت داده‌های GitHub نامعتبر است');
            }
            
            this.data = importedData;
            this.saveData();
            this.renderCurrentTab();
            this.showToast('اطلاعات با موفقیت از GitHub دریافت شد', 'success');
        } catch (error) {
            this.showToast('خطا در همگام‌سازی: ' + error.message, 'error');
        }
    }

    // Utility Functions
    formatCurrency(amount) {
        return new Intl.NumberFormat('fa-IR', {
            style: 'currency',
            currency: 'IRR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    getEmptyStateHTML(title, description) {
        return `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>${title}</h3>
                <p>${description}</p>
            </div>
        `;
    }

    showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // Theme Management
    setupTheme() {
        const savedTheme = this.data.settings.theme || 'dark';
        document.body.className = `${savedTheme}-theme`;
        this.updateThemeIcon(savedTheme);
    }

    toggleTheme() {
        const currentTheme = this.data.settings.theme || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.body.className = `${newTheme}-theme`;
        this.data.settings.theme = newTheme;
        this.saveData();
        this.updateThemeIcon(newTheme);
    }

    updateThemeIcon(theme) {
        const icon = document.querySelector('.theme-toggle i');
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    // Invoice Details
    showInvoiceDetails(type, invoiceId) {
        const modal = document.getElementById('modalOverlay');
        const title = document.getElementById('modalTitle');
        const content = document.getElementById('modalContent');
        
        const invoice = type === 'input' 
            ? this.data.inputInvoices.find(i => i.id === invoiceId)
            : this.data.salesInvoices.find(i => i.id === invoiceId);
            
        if (!invoice) return;
        
        title.textContent = type === 'input' ? 'جزئیات فاکتور ورودی' : 'جزئیات فاکتور فروش';
        
        const productsHTML = invoice.products.map(item => `
            <div class="item-card" style="margin-bottom: var(--space-sm);">
                <div class="item-card-header">
                    <h3 class="item-title">${item.productName}</h3>
                    <span class="item-amount">${this.formatCurrency(item.totalPrice)}</span>
                </div>
                <div class="item-subtitle">
                    <span>تعداد: ${item.quantity} × ${this.formatCurrency(item.unitPrice || item.sellingPrice)}</span>
                    ${item.description ? `<span>توضیحات: ${item.description}</span>` : ''}
                </div>
            </div>
        `).join('');
        
        const totalHTML = `
            <div class="stat-card" style="background-color: var(--primary-100); margin-top: var(--space-lg);">
                <div class="stat-value" style="color: var(--primary-500);">${this.formatCurrency(invoice.totalAmount)}</div>
                <div class="stat-label">مجموع کل</div>
                ${type === 'sales' ? `
                    <div class="stat-value" style="color: ${invoice.totalProfit >= 0 ? 'var(--success)' : 'var(--error)'}; margin-top: var(--space-sm);">
                        ${this.formatCurrency(invoice.totalProfit)}
                    </div>
                    <div class="stat-label">مجموع سود</div>
                ` : ''}
            </div>
        `;
        
        content.innerHTML = `
            <div class="input-group" style="margin-bottom: var(--space-lg);">
                <label>تاریخ فاکتور</label>
                <div style="padding: var(--space-sm); background-color: var(--border-subtle); border-radius: var(--radius-md);">
                    ${this.getPersianDateLong(new Date(invoice.date))}
                </div>
            </div>
            <div class="content-list">
                ${productsHTML}
            </div>
            ${totalHTML}
        `;
        
        modal.classList.add('active');
    }

    showProductDetails(productId) {
        const product = this.getProductById(productId);
        if (!product) return;
        
        const inventory = this.getInventory();
        const inventoryItem = inventory[productId];
        
        const modal = document.getElementById('modalOverlay');
        const title = document.getElementById('modalTitle');
        const content = document.getElementById('modalContent');
        
        title.textContent = 'جزئیات محصول';
        
        content.innerHTML = `
            <div class="stat-card" style="margin-bottom: var(--space-lg);">
                <h3 style="margin-bottom: var(--space-sm);">${product.name}</h3>
                <div class="stat-value">${this.formatCurrency(product.purchasePrice)}</div>
                <div class="stat-label">قیمت خرید</div>
            </div>
            
            <div class="report-stats">
                <div class="stat-card">
                    <div class="stat-value">${inventoryItem.totalInput}</div>
                    <div class="stat-label">مجموع ورود</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${inventoryItem.totalOutput}</div>
                    <div class="stat-label">مجموع خروج</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" style="color: ${inventoryItem.currentStock > 0 ? 'var(--success)' : 'var(--error)'}">
                        ${inventoryItem.currentStock}
                    </div>
                    <div class="stat-label">موجودی فعلی</div>
                </div>
            </div>
            
            <div class="input-group">
                <label>تاریخ ثبت محصول</label>
                <div style="padding: var(--space-sm); background-color: var(--border-subtle); border-radius: var(--radius-md);">
                    ${this.getPersianDateLong(new Date(product.createdAt))}
                </div>
            </div>
        `;
        
        modal.classList.add('active');
    }
}

// Initialize the application
const app = new AccountingSystem();

// Make app globally available for onclick handlers
window.app = app;
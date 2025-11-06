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

        // Event delegation for modal buttons
        document.addEventListener('click', (e) => {
            // Handle modal close button
            if (e.target.closest('.modal-close')) {
                e.preventDefault();
                this.hideModal();
                return;
            }
            
            // Handle cancel buttons with data-action
            if (e.target.matches('[data-action="close-modal"]') || 
                e.target.closest('[data-action="close-modal"]')) {
                e.preventDefault();
                this.hideModal();
                return;
            }
            
            // Handle overlay click to close
            if (e.target === e.target.closest('.modal-overlay')) {
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
    addProduct(name) {
        const product = {
            id: Date.now().toString(),
            name: name.trim(),
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
    addInputInvoice(products, date) {
        const invoice = {
            id: Date.now().toString(),
            date: date,
            products: products,
            createdAt: new Date().toISOString()
        };
        
        this.data.inputInvoices.push(invoice);
        this.saveData();
        return invoice;
    }

    addSalesInvoice(products, date) {
        const invoice = {
            id: Date.now().toString(),
            date: date,
            products: products,
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
                    <div class="item-card">
                        <div class="item-card-header">
                            <h3 class="item-title" onclick="app.showInvoiceDetails('input', '${invoice.id}')">فاکتور ${invoice.id.slice(-6)}</h3>
                            <div class="item-actions">
                                <button class="btn-icon" onclick="app.editInputInvoice('${invoice.id}')" title="ویرایش">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-icon btn-danger" onclick="app.deleteInputInvoice('${invoice.id}')" title="حذف">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div class="item-subtitle">
                            <span onclick="app.showInvoiceDetails('input', '${invoice.id}')">${this.getPersianDateLong(date)}</span>
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
                return `
                    <div class="item-card">
                        <div class="item-card-header">
                            <h3 class="item-title" onclick="app.showInvoiceDetails('sales', '${invoice.id}')">فاکتور ${invoice.id.slice(-6)}</h3>
                            <div class="item-actions">
                                <button class="btn-icon" onclick="app.editSalesInvoice('${invoice.id}')" title="ویرایش">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-icon btn-danger" onclick="app.deleteSalesInvoice('${invoice.id}')" title="حذف">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div class="item-subtitle">
                            <span onclick="app.showInvoiceDetails('sales', '${invoice.id}')">${this.getPersianDateLong(date)}</span>
                            <span class="item-status">${invoice.products.length} محصول</span>
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
                <button class="btn-primary" onclick="app.showAddInputInvoiceModal();" style="justify-content: flex-start;">
                    <i class="fas fa-file-import"></i>
                    ثبت فاکتور ورودی جدید
                </button>
                <button class="btn-primary" onclick="app.showAddSalesInvoiceModal();" style="justify-content: flex-start;">
                    <i class="fas fa-file-export"></i>
                    ثبت فاکتور فروش جدید
                </button>
                <button class="btn-secondary" onclick="app.showManageInventoryModal();" style="justify-content: flex-start;">
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
        
        content.innerHTML = `
            <form id="inputInvoiceForm">
                <div class="input-group">
                    <label>تاریخ</label>
                    <input type="date" name="date" required>
                </div>
                <div style="margin: var(--space-lg) 0;">
                    <h4>محصولات فاکتور</h4>
                    <div id="inputInvoiceProducts">
                        <!-- First product item will be added by addInputInvoiceItem() -->
                    </div>
                </div>
                <button type="button" class="btn-secondary" onclick="app.addInputInvoiceItem()" style="margin-bottom: var(--space-md);">
                    <i class="fas fa-plus"></i> افزودن محصول
                </button>
                <div style="display: flex; gap: var(--space-sm); margin-top: var(--space-lg);">
                    <button type="submit" class="btn-primary" style="flex: 1;">ثبت فاکتور</button>
                    <button type="button" class="btn-secondary" data-action="close-modal" style="flex: 1;">انصراف</button>
                </div>
            </form>
        `;
        
        modal.classList.add('active');
        
        // Set today's date
        const dateInput = content.querySelector('input[name="date"]');
        dateInput.valueAsDate = new Date();
        
        // Add the first product item by default
        this.addInputInvoiceItem();
        
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
        
        content.innerHTML = `
            <form id="salesInvoiceForm">
                <div class="input-group">
                    <label>تاریخ</label>
                    <input type="date" name="date" required>
                </div>
                <div style="margin: var(--space-lg) 0;">
                    <h4>محصولات فاکتور</h4>
                    <div id="salesInvoiceProducts">
                        <!-- First product item will be added by addSalesInvoiceItem() -->
                    </div>
                </div>
                <button type="button" class="btn-secondary" onclick="app.addSalesInvoiceItem()" style="margin-bottom: var(--space-md);">
                    <i class="fas fa-plus"></i> افزودن محصول
                </button>
                <div style="display: flex; gap: var(--space-sm); margin-top: var(--space-lg);">
                    <button type="submit" class="btn-primary" style="flex: 1;">ثبت فاکتور</button>
                    <button type="button" class="btn-secondary" data-action="close-modal" style="flex: 1;">انصراف</button>
                </div>
            </form>
        `;
        
        modal.classList.add('active');
        
        // Set today's date
        const dateInput = content.querySelector('input[name="date"]');
        dateInput.valueAsDate = new Date();
        
        // Add the first product item by default
        this.addSalesInvoiceItem();
        
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
                            <button type="button" class="btn-secondary" data-action="close-modal" style="flex: 1;">بستن</button>
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
        
        // Collect all products
        const products = [];
        const productItems = document.querySelectorAll('#inputInvoiceProducts .item-card');
        
        for (let i = 0; i < productItems.length; i++) {
            const item = productItems[i];
            const productIdSelect = item.querySelector('select[name^="productId_"]');
            const quantityInput = item.querySelector('input[name^="quantity_"]');
            const descriptionTextarea = item.querySelector('textarea[name^="description_"]');
            
            const productId = productIdSelect.value;
            const quantity = parseInt(quantityInput.value);
            const description = descriptionTextarea.value;
            
            if (!productId) {
                this.showToast('لطفاً محصول را انتخاب کنید', 'error');
                return;
            }
            
            if (quantity <= 0) {
                this.showToast('لطفاً تعداد معتبر وارد کنید', 'error');
                return;
            }
            
            let product;
            
            if (productId === 'new') {
                // New product
                const newProductNameInput = item.querySelector('input[name^="newProductName_"]');
                const newProductName = newProductNameInput.value.trim();
                
                if (!newProductName) {
                    this.showToast('لطفاً نام محصول جدید را وارد کنید', 'error');
                    return;
                }
                
                product = this.addProduct(newProductName);
            } else {
                // Existing product
                product = this.getProductById(productId);
            }
            
            products.push({
                productId: product.id,
                productName: product.name,
                quantity: quantity,
                description: description
            });
        }
        
        if (products.length === 0) {
            this.showToast('لطفاً حداقل یک محصول اضافه کنید', 'error');
            return;
        }
        
        this.addInputInvoice(products, date);
        
        this.hideModal();
        this.renderInputInvoices();
        this.renderInventory();
        this.showToast('فاکتور ورودی با موفقیت ثبت شد', 'success');
    }

    handleSalesInvoiceSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const date = formData.get('date');
        
        // Collect all products
        const products = [];
        const productItems = document.querySelectorAll('#salesInvoiceProducts .item-card');
        
        for (let i = 0; i < productItems.length; i++) {
            const item = productItems[i];
            const productIdSelect = item.querySelector('select[name^="productId_"]');
            const quantityInput = item.querySelector('input[name^="quantity_"]');
            const descriptionTextarea = item.querySelector('textarea[name^="description_"]');
            
            const productId = productIdSelect.value;
            const quantity = parseInt(quantityInput.value);
            const description = descriptionTextarea.value;
            
            if (!productId) {
                this.showToast('لطفاً محصول را انتخاب کنید', 'error');
                return;
            }
            
            if (quantity <= 0) {
                this.showToast('لطفاً تعداد معتبر وارد کنید', 'error');
                return;
            }
            
            // Check inventory availability
            const inventory = this.getInventory();
            const availableProduct = inventory[productId];
            
            if (!availableProduct || availableProduct.currentStock < quantity) {
                const productName = availableProduct?.product?.name || 'نامشخص';
                this.showToast(`موجودی محصول "${productName}" کافی نیست`, 'error');
                return;
            }
            
            products.push({
                productId: availableProduct.product.id,
                productName: availableProduct.product.name,
                quantity: quantity,
                description: description
            });
        }
        
        if (products.length === 0) {
            this.showToast('لطفاً حداقل یک محصول اضافه کنید', 'error');
            return;
        }
        
        this.addSalesInvoice(products, date);
        
        this.hideModal();
        this.renderSalesInvoices();
        this.renderInventory();
        this.showToast('فاکتور فروش با موفقیت ثبت شد', 'success');
    }

    handleAddProductSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const name = formData.get('name');
        const price = parseFloat(formData.get('price'));
        
        this.addProduct(name);
        e.target.reset();
        this.showToast('محصول با موفقیت اضافه شد', 'success');
        
        // Refresh the products list if modal is still open
        if (document.getElementById('modalOverlay').classList.contains('active')) {
            this.showManageInventoryModal();
        }
    }

    // Product Management
    editProduct(productId) {
        const product = this.getProductById(productId);
        if (!product) {
            this.showToast('محصول یافت نشد', 'error');
            return;
        }

        const modal = document.getElementById('modalOverlay');
        const title = document.getElementById('modalTitle');
        const content = document.getElementById('modalContent');
        
        title.textContent = 'ویرایش محصول';
        
        content.innerHTML = `
            <form id="editProductForm">
                <div class="input-group">
                    <label>نام محصول</label>
                    <input type="text" name="name" value="${product.name}" required>
                </div>
                <div style="display: flex; gap: var(--space-sm); margin-top: var(--space-lg);">
                    <button type="submit" class="btn-primary" style="flex: 1;">ذخیره تغییرات</button>
                    <button type="button" class="btn-secondary" data-action="close-modal" style="flex: 1;">انصراف</button>
                </div>
            </form>
        `;
        
        modal.classList.add('active');
        
        // Set up form submission
        content.querySelector('#editProductForm').addEventListener('submit', (e) => {
            this.handleEditProductSubmit(e, productId);
        });
    }

    handleEditProductSubmit(e, productId) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedName = formData.get('name');
        
        if (!updatedName) {
            this.showToast('لطفاً نام محصول را وارد کنید', 'error');
            return;
        }
        
        // Update product
        const productIndex = this.data.products.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
            this.data.products[productIndex].name = updatedName;
            this.data.products[productIndex].updatedAt = new Date().toISOString();
            
            this.saveData();
            this.showToast('محصول با موفقیت به‌روزرسانی شد', 'success');
            this.hideModal();
            
            // Refresh the products modal
            setTimeout(() => {
                this.showManageInventoryModal();
            }, 300);
        } else {
            this.showToast('خطا در به‌روزرسانی محصول', 'error');
        }
    }

    // Invoice Management
    editInputInvoice(invoiceId) {
        const invoice = this.data.inputInvoices.find(i => i.id === invoiceId);
        if (!invoice) {
            this.showToast('فاکتور یافت نشد', 'error');
            return;
        }

        const modal = document.getElementById('modalOverlay');
        const title = document.getElementById('modalTitle');
        const content = document.getElementById('modalContent');
        
        title.textContent = 'ویرایش فاکتور ورودی';
        
        const products = this.getAllProducts();
        const productsHTML = invoice.products.map((item, index) => `
            <div class="item-card" style="margin-bottom: var(--space-sm);">
                <div class="input-group">
                    <label>محصول ${index + 1}</label>
                    <select name="productId_${index}" data-index="${index}" required>
                        <option value="">انتخاب کنید</option>
                        ${products.map(p => 
                            `<option value="${p.id}" ${p.id === item.productId ? 'selected' : ''}>
                                ${p.name}
                            </option>`
                        ).join('')}
                    </select>
                </div>
                <div class="input-group" style="margin-top: var(--space-sm);">
                    <label>تعداد</label>
                    <input type="number" name="quantity_${index}" value="${item.quantity}" min="1" required>
                </div>
                <div class="input-group" style="margin-top: var(--space-sm);">
                    <label>توضیحات</label>
                    <textarea name="description_${index}" rows="2">${item.description || ''}</textarea>
                </div>
                <div style="text-align: center; margin-top: var(--space-sm);">
                    <button type="button" class="btn-secondary" onclick="app.removeInvoiceItem(this, ${index})" style="color: var(--error);">
                        <i class="fas fa-trash"></i> حذف این محصول
                    </button>
                </div>
            </div>
        `).join('');
        
        content.innerHTML = `
            <form id="editInputInvoiceForm">
                <div class="input-group">
                    <label>تاریخ</label>
                    <input type="date" name="date" value="${invoice.date}" required>
                </div>
                <div style="margin: var(--space-lg) 0;">
                    <h4>محصولات فاکتور</h4>
                    ${productsHTML}
                </div>
                <button type="button" class="btn-secondary" onclick="app.addInvoiceItem()" style="margin-bottom: var(--space-md);">
                    <i class="fas fa-plus"></i> افزودن محصول
                </button>
                <div style="display: flex; gap: var(--space-sm); margin-top: var(--space-lg);">
                    <button type="submit" class="btn-primary" style="flex: 1;">ذخیره تغییرات</button>
                    <button type="button" class="btn-secondary" data-action="close-modal" style="flex: 1;">انصراف</button>
                </div>
            </form>
        `;
        
        modal.classList.add('active');
        
        // Set up form submission
        content.querySelector('#editInputInvoiceForm').addEventListener('submit', (e) => {
            this.handleEditInputInvoiceSubmit(e, invoiceId);
        });
    }

    handleEditInputInvoiceSubmit(e, invoiceId) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const date = formData.get('date');
        
        // Collect all products
        const products = [];
        const invoice = this.data.inputInvoices.find(i => i.id === invoiceId);
        
        invoice.products.forEach((item, index) => {
            const productId = formData.get(`productId_${index}`);
            const quantity = parseInt(formData.get(`quantity_${index}`));
            const description = formData.get(`description_${index}`);
            
            if (productId && quantity > 0) {
                const product = this.getProductById(productId);
                products.push({
                    productId: productId,
                    productName: product.name,
                    quantity: quantity,
                    description: description
                });
            }
        });
        
        if (products.length === 0) {
            this.showToast('حداقل یک محصول معتبر وارد کنید', 'error');
            return;
        }
        
        // Update invoice
        const invoiceIndex = this.data.inputInvoices.findIndex(i => i.id === invoiceId);
        if (invoiceIndex !== -1) {
            this.data.inputInvoices[invoiceIndex].date = date;
            this.data.inputInvoices[invoiceIndex].products = products;
            this.data.inputInvoices[invoiceIndex].updatedAt = new Date().toISOString();
            
            this.saveData();
            this.showToast('فاکتور با موفقیت به‌روزرسانی شد', 'success');
            this.hideModal();
            
            // Refresh displays
            setTimeout(() => {
                this.renderInputInvoices();
                this.renderInventory();
            }, 300);
        } else {
            this.showToast('خطا در به‌روزرسانی فاکتور', 'error');
        }
    }

    removeInputInvoiceItem(button, index) {
        button.closest('.item-card').remove();
    }

    addInputInvoiceItem() {
        const products = this.getAllProducts();
        
        const productsOptions = [
            '<option value="">انتخاب کنید</option>',
            ...products.map(p => `<option value="${p.id}">${p.name}</option>`),
            '<option value="new">محصول جدید</option>'
        ].join('');
        
        const itemIndex = Date.now(); // Use timestamp for unique index
        
        const newItem = document.createElement('div');
        newItem.className = 'item-card';
        newItem.style.marginBottom = 'var(--space-sm)';
        newItem.innerHTML = `
            <div class="input-group">
                <label>محصول</label>
                <select name="productId_${itemIndex}" data-index="${itemIndex}" onchange="app.onInputProductSelect(this)" required>
                    <option value="">انتخاب کنید</option>
                    ${productsOptions}
                </select>
            </div>
            <div id="newProductFields_${itemIndex}" style="display: none;">
                <div class="input-group" style="margin-top: var(--space-sm);">
                    <label>نام محصول جدید</label>
                    <input type="text" name="newProductName_${itemIndex}" placeholder="نام محصول">
                </div>
            </div>
            <div style="display: flex; gap: var(--space-sm); margin-top: var(--space-sm);">
                <div class="input-group" style="flex: 1;">
                    <label>تعداد</label>
                    <input type="number" name="quantity_${itemIndex}" value="1" min="1" required>
                </div>
            </div>
            <div class="input-group" style="margin-top: var(--space-sm);">
                <label>توضیحات</label>
                <textarea name="description_${itemIndex}" rows="2" placeholder="توضیحات اضافی"></textarea>
            </div>
            <div style="text-align: center; margin-top: var(--space-sm);">
                <button type="button" class="btn-secondary" onclick="app.removeInputInvoiceItem(this, ${itemIndex})" style="color: var(--error);">
                    <i class="fas fa-trash"></i> حذف این محصول
                </button>
            </div>
        `;
        
        document.getElementById('inputInvoiceProducts').appendChild(newItem);
    }

    onInputProductSelect(select) {
        const index = select.dataset.index;
        const newProductFields = document.getElementById(`newProductFields_${index}`);
        
        if (select.value === 'new') {
            newProductFields.style.display = 'block';
        } else {
            newProductFields.style.display = 'none';
        }
    }

    deleteInputInvoice(invoiceId) {
        if (!confirm('آیا مطمئن هستید که می‌خواهید این فاکتور را حذف کنید؟')) {
            return;
        }
        
        const invoice = this.data.inputInvoices.find(i => i.id === invoiceId);
        if (!invoice) {
            this.showToast('فاکتور یافت نشد', 'error');
            return;
        }
        
        // Remove invoice
        this.data.inputInvoices = this.data.inputInvoices.filter(i => i.id !== invoiceId);
        
        this.saveData();
        this.showToast('فاکتور با موفقیت حذف شد', 'success');
        
        // Refresh displays
        this.renderInputInvoices();
        this.renderInventory();
    }

    removeInvoiceItem(button, index) {
        button.closest('.item-card').remove();
    }

    addInvoiceItem() {
        const products = this.getAllProducts();
        const productsOptions = products.map(p => 
            `<option value="${p.id}">${p.name} - ${this.formatCurrency(p.purchasePrice)}</option>`
        ).join('');
        
        const itemIndex = Date.now(); // Use timestamp for unique index
        
        const newItem = document.createElement('div');
        newItem.className = 'item-card';
        newItem.style.marginBottom = 'var(--space-sm)';
        newItem.innerHTML = `
            <div class="input-group">
                <label>محصول جدید</label>
                <select name="productId_${itemIndex}" data-index="${itemIndex}" required>
                    <option value="">انتخاب کنید</option>
                    ${productsOptions}
                </select>
            </div>
            <div style="display: flex; gap: var(--space-sm); margin-top: var(--space-sm);">
                <div class="input-group" style="flex: 1;">
                    <label>تعداد</label>
                    <input type="number" name="quantity_${itemIndex}" value="1" min="1" required>
                </div>
                <div class="input-group" style="flex: 1;">
                    <label>قیمت واحد</label>
                    <input type="number" name="unitPrice_${itemIndex}" step="0.01" required>
                </div>
            </div>
            <div class="input-group" style="margin-top: var(--space-sm);">
                <label>توضیحات</label>
                <textarea name="description_${itemIndex}" rows="2"></textarea>
            </div>
            <div style="text-align: center; margin-top: var(--space-sm);">
                <button type="button" class="btn-secondary" onclick="this.closest('.item-card').remove()" style="color: var(--error);">
                    <i class="fas fa-trash"></i> حذف این محصول
                </button>
            </div>
        `;
        
        // Add to form
        const form = document.getElementById('editInputInvoiceForm');
        const productsSection = form.querySelector('h4').parentNode;
        productsSection.appendChild(newItem);
    }

    // Sales Invoice Management
    editSalesInvoice(invoiceId) {
        const invoice = this.data.salesInvoices.find(i => i.id === invoiceId);
        if (!invoice) {
            this.showToast('فاکتور یافت نشد', 'error');
            return;
        }

        const modal = document.getElementById('modalOverlay');
        const title = document.getElementById('modalTitle');
        const content = document.getElementById('modalContent');
        
        title.textContent = 'ویرایش فاکتور فروش';
        
        const inventory = this.getInventory();
        const availableProducts = Object.values(inventory).filter(item => item.currentStock > 0);
        
        const productsHTML = invoice.products.map((item, index) => `
            <div class="item-card" style="margin-bottom: var(--space-sm);">
                <div class="input-group">
                    <label>محصول ${index + 1}</label>
                    <select name="productId_${index}" data-index="${index}" required>
                        <option value="">انتخاب کنید</option>
                        ${availableProducts.map(p => 
                            `<option value="${p.product.id}" ${p.product.id === item.productId ? 'selected' : ''}>
                                ${p.product.name} - موجودی: ${p.currentStock}
                            </option>`
                        ).join('')}
                    </select>
                </div>
                <div class="input-group" style="margin-top: var(--space-sm);">
                    <label>تعداد</label>
                    <input type="number" name="quantity_${index}" value="${item.quantity}" min="1" max="${availableProducts.find(p => p.product.id === item.productId)?.currentStock || 0}" required>
                </div>
                <div class="input-group" style="margin-top: var(--space-sm);">
                    <label>توضیحات</label>
                    <textarea name="description_${index}" rows="2">${item.description || ''}</textarea>
                </div>
                <div style="text-align: center; margin-top: var(--space-sm);">
                    <button type="button" class="btn-secondary" onclick="app.removeSalesInvoiceItem(this, ${index})" style="color: var(--error);">
                        <i class="fas fa-trash"></i> حذف این محصول
                    </button>
                </div>
            </div>
        `).join('');
        
        content.innerHTML = `
            <form id="editSalesInvoiceForm">
                <div class="input-group">
                    <label>تاریخ</label>
                    <input type="date" name="date" value="${invoice.date}" required>
                </div>
                <div style="margin: var(--space-lg) 0;">
                    <h4>محصولات فاکتور</h4>
                    ${productsHTML}
                </div>
                <button type="button" class="btn-secondary" onclick="app.addSalesInvoiceItem()" style="margin-bottom: var(--space-md);">
                    <i class="fas fa-plus"></i> افزودن محصول
                </button>
                <div style="display: flex; gap: var(--space-sm); margin-top: var(--space-lg);">
                    <button type="submit" class="btn-primary" style="flex: 1;">ذخیره تغییرات</button>
                    <button type="button" class="btn-secondary" data-action="close-modal" style="flex: 1;">انصراف</button>
                </div>
            </form>
        `;
        
        modal.classList.add('active');
        
        // Set up form submission
        content.querySelector('#editSalesInvoiceForm').addEventListener('submit', (e) => {
            this.handleEditSalesInvoiceSubmit(e, invoiceId);
        });
    }

    handleEditSalesInvoiceSubmit(e, invoiceId) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const date = formData.get('date');
        
        // Collect all products
        const products = [];
        const invoice = this.data.salesInvoices.find(i => i.id === invoiceId);
        const inventory = this.getInventory();
        
        invoice.products.forEach((item, index) => {
            const productId = formData.get(`productId_${index}`);
            const quantity = parseInt(formData.get(`quantity_${index}`));
            const description = formData.get(`description_${index}`);
            
            if (productId && quantity > 0) {
                const availableProduct = inventory[productId];
                if (availableProduct && availableProduct.currentStock >= quantity) {
                    const product = availableProduct.product;
                    
                    products.push({
                        productId: productId,
                        productName: product.name,
                        quantity: quantity,
                        description: description
                    });
                }
            }
        });
        
        if (products.length === 0) {
            this.showToast('حداقل یک محصول معتبر وارد کنید', 'error');
            return;
        }
        
        // Update invoice
        const invoiceIndex = this.data.salesInvoices.findIndex(i => i.id === invoiceId);
        if (invoiceIndex !== -1) {
            this.data.salesInvoices[invoiceIndex].date = date;
            this.data.salesInvoices[invoiceIndex].products = products;
            this.data.salesInvoices[invoiceIndex].updatedAt = new Date().toISOString();
            
            this.saveData();
            this.showToast('فاکتور فروش با موفقیت به‌روزرسانی شد', 'success');
            this.hideModal();
            
            // Refresh displays
            setTimeout(() => {
                this.renderSalesInvoices();
                this.renderInventory();
            }, 300);
        } else {
            this.showToast('خطا در به‌روزرسانی فاکتور', 'error');
        }
    }

    deleteSalesInvoice(invoiceId) {
        if (!confirm('آیا مطمئن هستید که می‌خواهید این فاکتور فروش را حذف کنید؟')) {
            return;
        }
        
        const invoice = this.data.salesInvoices.find(i => i.id === invoiceId);
        if (!invoice) {
            this.showToast('فاکتور یافت نشد', 'error');
            return;
        }
        
        // Remove invoice
        this.data.salesInvoices = this.data.salesInvoices.filter(i => i.id !== invoiceId);
        
        this.saveData();
        this.showToast('فاکتور فروش با موفقیت حذف شد', 'success');
        
        // Refresh displays
        this.renderSalesInvoices();
        this.renderInventory();
    }

    removeSalesInvoiceItem(button, index) {
        button.closest('.item-card').remove();
    }

    addSalesInvoiceItem() {
        const inventory = this.getInventory();
        const availableProducts = Object.values(inventory).filter(item => item.currentStock > 0);
        
        if (availableProducts.length === 0) {
            this.showToast('هیچ محصولی برای فروش موجود نیست', 'error');
            return;
        }
        
        const productsOptions = availableProducts.map(item => 
            `<option value="${item.product.id}">${item.product.name} - موجودی: ${item.currentStock}</option>`
        ).join('');
        
        const itemIndex = Date.now(); // Use timestamp for unique index
        
        const newItem = document.createElement('div');
        newItem.className = 'item-card';
        newItem.style.marginBottom = 'var(--space-sm)';
        newItem.innerHTML = `
            <div class="input-group">
                <label>محصول جدید</label>
                <select name="productId_${itemIndex}" data-index="${itemIndex}" required>
                    <option value="">انتخاب کنید</option>
                    ${productsOptions}
                </select>
            </div>
            <div class="input-group" style="margin-top: var(--space-sm);">
                <label>تعداد</label>
                <input type="number" name="quantity_${itemIndex}" value="1" min="1" required>
            </div>
            <div class="input-group" style="margin-top: var(--space-sm);">
                <label>توضیحات</label>
                <textarea name="description_${itemIndex}" rows="2"></textarea>
            </div>
            <div style="text-align: center; margin-top: var(--space-sm);">
                <button type="button" class="btn-secondary" onclick="this.closest('.item-card').remove()" style="color: var(--error);">
                    <i class="fas fa-trash"></i> حذف این محصول
                </button>
            </div>
        `;
        
        // Add to form
        const form = document.getElementById('editSalesInvoiceForm');
        const productsSection = form.querySelector('h4').parentNode;
        productsSection.appendChild(newItem);
    }

    // Product Selection Handlers



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

    // Modal Management
    hideModal() {
        const modal = document.getElementById('modalOverlay');
        modal.classList.remove('active');
        
        // Clear modal content
        setTimeout(() => {
            const content = document.getElementById('modalContent');
            content.innerHTML = '';
        }, 300);
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
                </div>
                <div class="item-subtitle">
                    <span>تعداد: ${item.quantity}</span>
                    ${item.description ? `<span>توضیحات: ${item.description}</span>` : ''}
                </div>
            </div>
        `).join('');
        
        const actionsHTML = type === 'input' ? `
            <div style="display: flex; gap: var(--space-sm); margin-top: var(--space-lg);">
                <button class="btn-primary" onclick="app.editInputInvoice('${invoiceId}')" style="flex: 1;">
                    <i class="fas fa-edit"></i> ویرایش
                </button>
                <button class="btn-secondary" onclick="app.deleteInputInvoice('${invoiceId}')" style="flex: 1; color: var(--error); border-color: var(--error);">
                    <i class="fas fa-trash"></i> حذف
                </button>
            </div>
        ` : type === 'sales' ? `
            <div style="display: flex; gap: var(--space-sm); margin-top: var(--space-lg);">
                <button class="btn-primary" onclick="app.editSalesInvoice('${invoiceId}')" style="flex: 1;">
                    <i class="fas fa-edit"></i> ویرایش
                </button>
                <button class="btn-secondary" onclick="app.deleteSalesInvoice('${invoiceId}')" style="flex: 1; color: var(--error); border-color: var(--error);">
                    <i class="fas fa-trash"></i> حذف
                </button>
            </div>
        ` : '';
        
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
            ${actionsHTML}
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
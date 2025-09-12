أريد منك التعديل على مشروع Vue.js الخاص بي بحيث:

1. في كل صفحة (View) موجودة في routes التالية:
   - ProfileView.vue
   - Dashboard/DashboardHome.vue
   - Dashboard/Orders.vue
   - Dashboard/OrderDetails.vue
   - Dashboard/ClientDash.vue
   - Dashboard/ClientInfo.vue
   - Dashboard/Books.vue
   - Dashboard/BookDetails.vue
   - Dashboard/Categories.vue
   - Dashboard/CategoriesInfo.vue
   - Dashboard/EditCategory.vue
   - Dashboard/AuthorsView.vue
   - Dashboard/AuthorDetails.vue
   - Dashboard/SettingsPage.vue
   - Dashboard/publishing-house.vue
   - Dashboard/PHouseDetails.vue

2. إذا لم يكن هناك Loader مدمج، قم بإضافة **LoaderWithText.vue** بنفس الأسلوب المستخدم في `BookDetailsView.vue`.

3. اربط الـ Loader مع الـ store المناسب للصفحة (مثل booksStore, authorsStore, categoriesStore…).
   - بحيث يظهر LoaderWithText عندما يكون `isLoading = true` في الـ store.
   - ويختفي عندما تكون البيانات جاهزة.

4. اجعل Loader متناسقًا مع تصميم المشروع، ومكان ظهوره بنفس أسلوب BookDetailsView.vue.

5. لا تقم بتكرار الكود كثيرًا. إذا كان هناك طريقة لإعادة استخدام منطق الـ Loader (مثل HOC أو Composable) قم بذلك لتقليل التكرار.

import Category from '../models/category.model.js';
import Product from '../models/product.model.js';
import Size from '../models/size.model.js';
import Topping from '../models/topping.model.js';
import productValidate from '../validates/product.validate.js';

export const ProductController = {
  createProduct: async (req, res, next) => {
    try {
      const Data = req.body;

      const { category } = Data;
      const { error } = productValidate.validate(Data, { abortEarly: false });
      if (error) {
        return res
          .status(400)
          .json({ message: 'fail', err: error.details.map((err) => err.message) });
      }
      const existCategory = await Category.findById(category);
      if (!existCategory) {
        return res.status(404).json({ message: 'fail', err: 'Create Product failed' });
      }
      const product = await Product.create(Data);
      if (!product) {
        return res.status(400).json({ message: 'fail', err: 'Create Product failed' });
      }
      // /* tạo ra bảng size & giá luôn */
      // const { sizes } = Data;
      // // if (sizes.length > 0) {
      // //   for (let size of sizes) {
      // //     const sizeItem = {
      // //       name: size.name,
      // //       price: size.price,
      // //       productId: product._id,
      // //     };
      // //     await Size.create(sizeItem);
      // //   }
      // // }
      await existCategory.updateOne({ $addToSet: { products: product._id } });
      /* tạo ra bảng size & giá luôn */
      // const { sizes } = Data;
      // if (sizes.length > 0) {
      //   for (let size of sizes) {
      //     const sizeItem = {
      //       name: size.name,
      //       price: size.price,
      //       productId: product._id,
      //     };
      //     await Size.create(sizeItem);
      //   }
      // }
      // await Size.updateMany(
      //   { _id: { $in: sizes } },
      //   { $push: { productId: product._id } },
      //   { multi: true }
      // );
      /* update category */
      /* update id product topping array */
      const { toppings } = Data;
      if (toppings.length > 0) {
        for (let i = 0; i < toppings.length; i++) {
          await Topping.findByIdAndUpdate(toppings[i], {
            $addToSet: { products: product._id },
          });
        }
      }
      return res.status(200).json({ message: 'success', data: product });
    } catch (error) {
      next(error);
    }
  },

  createProductV2: async (req, res, next) => {
    try {
      const body = req.body;
      const productData = {
        name: body.name,
        description: body.description,
        images: body.images,
        sale: body.sale,
        is_active: body.is_active,
        idUser: body.idUser,
      };
      const product = await Product.create(productData);
      if (!product) {
        return res.status(400).json({ message: 'fail', err: 'Create Product failed' });
      }
      return res.status(200).json({ message: 'success', data: product });
    } catch (error) {
      return res.status(500).json({ message: 'fail', err: error.message });
    }
  },

  /* lấy ra các sản phẩm đang hoạt động */
  getAllProducts: async (req, res, next) => {
    try {
      const { _page = 1, _limit = 10, q = '', c = '' } = req.query;
      let query = { $and: [{ is_deleted: false }, { is_active: true }] };
      const options = {
        page: _page,
        limit: _limit,
        sort: { createdAt: -1 },
        populate: [
          { path: 'category', select: 'name' },
          { path: 'sizes', select: 'name price is_default' },
          { path: 'toppings', select: 'name price' },
        ],
      };
      if (q && !c) {
        query = {
          $and: [
            {
              $or: [{ name: { $regex: q, $options: 'i' } }],
            },
            { is_deleted: false },
            { is_active: true },
          ],
        };
      } else if (c && !q) {
        query = {
          $and: [
            {
              $or: [{ category: { _id: c } }],
            },
            { is_deleted: false },
            { is_active: true },
          ],
        };
      } else if (q && c) {
        query = {
          $and: [
            {
              $or: [{ name: { $regex: q, $options: 'i' } }],
            },
            {
              $or: [{ category: { _id: c } }],
            },
            { is_deleted: false },
            { is_active: true },
          ],
        };
      }
      const products = await Product.paginate(query, options);
      if (!products) {
        return res.status(404).json({ message: 'fail', err: 'Not found any size' });
      }
      return res.status(200).json({ ...products });
    } catch (error) {
      next(error);
    }
  },

  /* lấy ra 1 sản phẩm */
  getProduct: async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id).populate([
        { path: 'category', select: 'name' },
        { path: 'sizes', select: 'name price is_default' },
        { path: 'toppings', select: '-products' },
      ]);
      if (!product) {
        return res.status(404).json({ message: 'fail', err: 'Not found Product' });
      }
      return res.status(200).json({ message: 'success', data: product });
    } catch (error) {
      next(error);
    }
  },

  /* cập nhật sản phẩm */
  updateProduct: async (req, res, next) => {
    try {
      const { category } = req.body;
      const { error } = productValidate.validate(req.body, { abortEarly: false });
      if (error) {
        return res
          .status(400)
          .json({ message: 'fail', err: error.details.map((err) => err.message) });
      }
      const existCategory = await Category.findById(category);
      if (!existCategory) {
        return res.status(404).json({ message: 'fail', err: 'Not found category' });
      }
      const product = await Product.findById(req.params.id);
      const CatRefProduct = await Category.findByIdAndUpdate(product.category, {
        $pull: { products: req.params.id },
      });

      // /* cập nhật lại size */
      const sizes = product.sizes;
      const sizeListNew = [];
      const sizeBody = req.body.size;
      if (sizeBody.length > 0) {
        const results = sizeBody.filter((sizeItem) => {
          return !sizeItem._id;
        });
        if (results.length > 0) {
          for (let sizeItem of results) {
            const size = await Size.create(sizeItem);
            sizeListNew.push(size);
          }
        }
      }
      if (sizes.length > 0) {
        for (let i = 0; i < sizes.length; i++) {
          await Size.findByIdAndUpdate(sizes[i], {
            $pull: { productId: product._id },
          });
        }
      }

      const { size, sizeDefault } = req.body;

      if (size.length > 0) {
        for (let sizeItem of size) {
          await Size.findByIdAndUpdate(sizeItem._id, sizeItem, { new: true });
          sizeListNew.push(sizeItem._id);
        }
      }
      const data = { ...req.body, sizes: [...sizeListNew, ...sizeDefault] };
      const resultUpdate = await Product.findByIdAndUpdate(req.body._id, data, { new: true });
      if (!resultUpdate) {
        return res.status(500).json({ message: 'fail', err: 'Update failed' });
      }
      if (!CatRefProduct) {
        return res.status(404).json({ message: 'fail', err: 'Update failed' });
      }

      /* cập nhật lại topping */
      const toppings = product.toppings;
      if (toppings.length > 0) {
        for (let i = 0; i < toppings.length; i++) {
          await Topping.findByIdAndUpdate(toppings[i], {
            $pull: { products: product._id },
          });
        }
      }
      const updateTopping = req.body.toppings;
      if (updateTopping.length > 0) {
        for (let i = 0; i < updateTopping.length; i++) {
          await Topping.findByIdAndUpdate(updateTopping[i], {
            $addToSet: { products: product._id },
          });
        }
      }

      if (!product) {
        return res.status(404).json({ message: 'fail', err: 'Not found Product to update' });
      }
      await existCategory.updateOne({ $addToSet: { products: product._id } });
      return res.status(200).json({ message: 'success', data: product });
    } catch (error) {
      next(error);
    }
  },

  // updateProduct: async (req, res, next) => {
  //   try {
  //     const body = req.body;
  //     console.log('🚀 ~ file: product.controller.js:292 ~ updateProduct: ~ body:', body);
  //     const { id } = req.params;
  //     const { category } = req.body;
  //     const { error } = productValidate.validate(req.body, { abortEarly: false });
  //     if (error) {
  //       return res
  //         .status(400)
  //         .json({ message: 'fail', err: error.details.map((err) => err.message) });
  //     }
  //     const existCategory = await Category.findById(category);
  //     if (!existCategory) {
  //       return res.status(404).json({ message: 'fail', err: 'Not found category' });
  //     }
  //     /* dựa vào id và tìm ra produc có tồn tại hay khong */
  //     const productExit = await Product.findById(id);
  //     if (!productExit) {
  //       return res.status(404).json({ message: 'fail', err: 'Not found Product' });
  //     }
  //     /* delete size đó luôn */
  //     if (productExit.sizes.length > 0) {
  //       const sizeList = productExit.sizes;
  //       if (sizeList.length > 0) {
  //         for (let size of sizeList) {
  //           await Size.findByIdAndDelete(size);
  //         }
  //       }
  //     }
  //     /* gỡ topping trước đó mà product đã gắn */
  //     const toppingList = productExit.toppings;
  //     if (toppingList.length > 0) {
  //       for (let topping of toppingList) {
  //         await Topping.findByIdAndUpdate(topping, {
  //           $pull: { products: productExit._id },
  //         });
  //       }
  //     }
  //     /* gỡ category ra khỏi product */
  //     await Category.findByIdAndUpdate(productExit.category, {
  //       $pull: { products: productExit._id },
  //     });
  //     const { size, sizeDefault, toppings } = body;
  //     /* tạo size */
  //     const sizeListNew = [];
  //     if (sizes.length > 0) {
  //       for (let size of sizes) {
  //         const sizeItem = {
  //           name: size.name,
  //           price: size.price,
  //         };
  //         const result = await Size.create(sizeItem);
  //         sizeListNew.push(result._id);
  //       }
  //     }
  //     console.log('first ahihi');
  //     /* update product đó */
  //     const data = { ...body, sizes: sizeListNew };
  //     console.log('🚀 ~ file: product.controller.js:200 ~ updateProduct: ~ data:', data);
  //     const productUpdate = await Product.findByIdAndUpdate({ _id: id }, data, { new: true });
  //     if (!productUpdate) {
  //       return res.status(404).json({ message: 'fail', err: 'Update Product failed' });
  //     }
  //     /* update id product to category */
  //     for (let topping of body.toppings) {
  //       await Topping.findByIdAndUpdate(topping, {
  //         $addToSet: { products: productUpdate._id },
  //       });
  //     }
  //     /* update category */
  //     await Category.findByIdAndUpdate(body.category, {
  //       $addToSet: { products: productUpdate._id },
  //     }).exec();
  //     return res.status(200).json({ message: 'success', data: productUpdate });
  //   } catch (error) {
  //     next(error);
  //   }
  // },

  /* xóa cứng */
  deleteRealProduct: async (req, res, next) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      /* delete product */
      // const updateCategory = await Category.findByIdAndUpdate(product.category, {
      //   $pull: { products: product._id },
      // });
      // if (!updateCategory) {
      //   return res.status(404).json({ message: 'fail', err: 'Delete Product failed' });
      // }
      /* delete topping */
      // const toppings = product.toppings;
      // if (toppings.length > 0) {
      //   for (let i = 0; i < toppings.length, i++; ) {
      //     await Topping.findByIdAndUpdate(toppings[i], {
      //       $pull: { products: product._id },
      //     });
      //   }
      // }
      // /* xóa size */
      // const sizes = product.sizes;
      // if (sizes.length > 0) {
      //   for (let size of sizes) {
      //     await Size.findByIdAndDelete(size._id);
      //   }
      // }
      // if (!product) {
      //   return res.status(404).json({ message: 'fail', err: 'Delete Product failed' });
      // }
      return res.status(200).json({ message: 'success', data: product });
    } catch (error) {
      next(error);
    }
  },

  /* xóa mềm */
  deleteFakeProduct: async (req, res, next) => {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
          is_deleted: true,
        },
        { new: true }
      );

      /* khi người dùng xóa mềm product đi rồi thì cateogry cũng sẽ tự động cho product out */
      const updateCategory = await Category.findByIdAndUpdate(product.category, {
        $pull: { products: product._id },
      });
      if (!updateCategory) {
        return res.status(404).json({ message: 'fail', err: 'Delete Product failed' });
      }

      await Size.updateMany({ _id: { $in: product.sizes } }, { $pull: { productId: product._id } });

      /* kèm topping cũng sẽ bị xóa đi */
      const toppings = product.toppings;
      if (toppings.length > 0) {
        for (let i = 0; i < toppings.length, i++; ) {
          await Topping.findByIdAndUpdate(toppings[i], {
            $pull: { products: product._id },
          });
        }
      }
      if (!product) {
        return res.status(404).json({ message: 'fail', err: 'Delete Product failed' });
      }
      return res.status(200).json({ message: 'success', data: product });
    } catch (error) {
      next(error);
    }
  },

  /* khôi phục sản phẩm */
  restoreProduct: async (req, res, next) => {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
          is_deleted: false,
        },
        { new: true }
      );

      const updateCategory = await Category.findByIdAndUpdate(product.category, {
        $addToSet: { products: product._id },
      });

      if (!updateCategory) {
        return res.status(404).json({ message: 'fail', err: 'Restore Product failed' });
      }

      await Size.updateMany(
        { _id: { $in: product.sizes } },
        { $addToSet: { productId: product._id } }
      );

      /* khi khôi phục lại sản phẩm thì cũng sẽ có các topping đi kèm import vào */
      const toppings = product.toppings;
      if (toppings.length > 0) {
        for (let i = 0; i < toppings.length, i++; ) {
          await Topping.findByIdAndUpdate(toppings[i], {
            $addToSet: { products: product._id },
          });
        }
      }
      if (!product) {
        return res.status(404).json({ message: 'fail', err: 'Restore Product failed' });
      }
      return res.status(200).json({ message: 'success', data: product });
    } catch (error) {
      next(error);
    }
  },

  /* lấy ra tất cả sản phẩm không tính is_delete hay is_active */
  getAllProductsStore: async (req, res, next) => {
    try {
      const { _page = 1, _limit = 10, query = '' } = req.query;
      const options = {
        page: _page,
        limit: _limit,
        sort: { createdAt: -1 },
        populate: [
          { path: 'category', select: 'name' },
          { path: 'sizes', select: 'name price is_default' },
          { path: 'toppings', select: 'name price' },
        ],
      };
      if (query) {
        const products = await Product.paginate(
          {
            $or: [
              { name: { $regex: query, $options: 'i' } },
              { description: { $regex: query, $options: 'i' } },
            ],
          },
          options
        );
        return res.status(200).json({ ...products });
      }
      const products = await Product.paginate({}, options);
      if (!products) {
        return res.status(404).json({ message: 'fail', err: 'Not found any size' });
      }
      return res.status(200).json({ ...products });
    } catch (error) {
      return res.status(500).json({ message: 'fail', err: error });
    }
  },

  /* get all products is_delete = true */
  getAllProductsDeletedTrueActiveTrue: async (req, res) => {
    try {
      const { _page = 1, _limit = 10, query = '' } = req.query;
      const options = {
        page: _page,
        limit: _limit,
        sort: { createdAt: -1 },
        populate: [
          { path: 'category', select: 'name' },
          { path: 'sizes', select: 'name price' },
          { path: 'toppings', select: 'name price' },
        ],
      };
      if (query) {
        const products = await Product.paginate(
          {
            $or: [
              { name: { $regex: query, $options: 'i' } },
              { description: { $regex: query, $options: 'i' } },
            ],
          },
          options
        );
        return res.status(200).json({ ...products });
      }
      const products = await Product.paginate({ $and: [{ is_deleted: true }] }, options);
      if (!products) {
        return res.status(404).json({ message: 'fail', err: 'Not found any size' });
      }
      return res.status(200).json({ ...products });
    } catch (error) {
      return res.status(500).json({ message: 'fail', err: error });
    }
  },

  /* lấy ra các sản phẩm is_delete = false/ is_active là false */
  getAllProductInActive: async (req, res) => {
    try {
      const { _page = 1, _limit = 10, query = '' } = req.query;
      const options = {
        page: _page,
        limit: _limit,
        sort: { createdAt: -1 },
        populate: [
          { path: 'category', select: 'name' },
          { path: 'sizes', select: 'name price' },
          { path: 'toppings', select: 'name price' },
        ],
      };
      if (query) {
        const products = await Product.paginate(
          {
            $or: [
              { name: { $regex: query, $options: 'i' } },
              { description: { $regex: query, $options: 'i' } },
            ],
          },
          options
        );
        return res.status(200).json({ ...products });
      }
      const products = await Product.paginate(
        { $and: [{ is_deleted: false }, { is_active: false }] },
        options
      );
      if (!products) {
        return res.status(404).json({ message: 'fail', err: 'Not found any size' });
      }
      return res.status(200).json({ ...products });
    } catch (error) {
      return res.status(500).json({ message: 'fail', err: error });
    }
  },
};

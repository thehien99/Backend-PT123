import { Op } from "sequelize";
import db from "../models";
import { v4 } from "uuid";
import moment from 'moment';
import generateCode from "../untils/generateCode";
import generaDate from "../untils/generateDate";
require('dotenv').config()

const getAllPost = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await db.Post.findAll({
        raw: true,
        nest: true,
        include: [
          { model: db.Image, as: "images", attributes: ["image"] },
          {
            model: db.Attribute,
            as: "attributes",
            attributes: ["price", "acreage", "published", "hashtag"],
          },
          {
            model: db.Seller,
            as: "sellers",
            attributes: ["name", "phone", "zalo", "avatar"],
          },
        ],
        attributes: ["id", "title", "star", "address", "description"],
      });
      resolve({
        err: response ? 1 : 0,
        msg: response ? "ok" : "fail",
        response,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getPostLimit = (params, { limitPost, order, ...query }, { priceNumber, areaNumber }) => {
  return new Promise(async (resolve, reject) => {
    try {
      let page = (!params || +params <= 1) ? 0 : (+params - 1);
      let queries = { ...query };
      let limit = +limitPost || 5
      queries.limit = limit
      if (priceNumber) query.priceNumber = { [Op.between]: priceNumber };
      if (areaNumber) query.areaNumber = { [Op.between]: areaNumber };
      if (order) queries.order = [order];
      const response = await db.Post.findAndCountAll({
        where: query,
        raw: true,
        offset: page * limit,
        nest: true,
        ...queries,
        include: [
          { model: db.Image, as: "images", attributes: ["image"] },
          {
            model: db.Attribute,
            as: "attributes",
            attributes: ["price", "acreage", "published", "hashtag"],
          },
          {
            model: db.Seller,
            as: "sellers",
            attributes: ["name", "phone", "zalo", "avatar"],
          },
          { model: db.Overview, as: "overviews" },
          { model: db.Label, as: "labels", attributes: { exclude: ['createdAt', 'updatedAt'] } }

        ],
        attributes: ["id", "title", "star", "address", "description"],
      });
      resolve({
        err: response ? 1 : 0,
        msg: response ? "ok" : "fail",
        response,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getNewPost = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await db.Post.findAll({
        raw: true,
        nest: true,
        offset: 0,
        order: [["createdAt", "DESC"]],
        limit: 5,
        include: [
          { model: db.Image, as: "images", attributes: ["image"] },
          {
            model: db.Attribute,
            as: "attributes",
            attributes: ["price", "acreage", "published", "hashtag"],
          },
        ],
        attributes: ["id", "title", "star", "createdAt"],
      });
      resolve({
        msg: "oke",
        response,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const createNewPost = (body) => new Promise(async (resolve, reject) => {
  try {
    const postId = v4();
    const attributesId = v4();
    const imagesId = v4();
    const overviewId = v4();
    const labelCode = generateCode(body.label);
    const provinceCode = body?.province.includes("Thành phố")
      ? generateCode(body.province.replace("Thành phố", ""))
      : generateCode(body.province.replace("Tỉnh", ""));
    const hashtag = `#${Math.floor(Math.random() * Math.pow(10, 6))}`;
    const currentDate = generaDate();
    await db.Post.create({
      id: postId,
      title: body.title,
      labelCode,
      address: body.address,
      attributesId,
      categoryCode: body.categoryCode,
      description: JSON.stringify(body.description?.split(/[.]/)) || null,
      userId: body.userID,
      overviewId,
      imagesId,
      areaCode: body.areaCode,
      priceCode: body.priceCode,
      provinceCode,
      priceNumber: body.priceNumber,
      areaNumber: body.areaNumber,
    });
    await db.Attribute.create({
      id: attributesId,
      price:
        +body.priceNumber < 1
          ? `${+body.priceNumber * 1000000}đồng/tháng`
          : `${+body.priceNumber}triệu đồng/tháng`,
      acreage: `${body.areaNumber}m2`,
      published: moment(new Date).format("DD/MM/YYYY"),
      hashtag: hashtag.slice(1)
    });
    await db.Image.create({
      id: imagesId,
      image: JSON.stringify(body.images),
    });
    await db.Overview.create({
      id: overviewId,
      code: hashtag,
      area: body.label,
      type: body.categoryValue,
      target: body.target,
      bonus: 'Tin thường',
      created: currentDate.today,
      expired: currentDate.expireDay
    });
    await db.Province.findOrCreate({
      where: {
        code: provinceCode
      },
      defaults: {
        code: provinceCode,
        value: body?.province.includes("Thành phố")
          ? (body.province.replace("Thành phố", "").replace(" ", ""))
          : (body.province.replace("Tỉnh", "").replace(" ", "")),
      }
    })
    await db.Label.findOrCreate({
      where: {
        code: labelCode
      },
      defaults: {
        code: labelCode,
        value: body.label
      }
    })
    resolve({
      msg: 'ok'
    })
  } catch (error) { reject(error) }
});

const postAdminService = (params, id, query) => new Promise(async (resolve, reject) => {
  try {
    let page = !params || +params <= 1 ? 0 : +params - 1;
    let queries = { ...query, userId: id };
    const response = await db.Post.findAndCountAll({
      where: queries,
      raw: true,
      offset: page * +process.env.LIMIT || 0,
      limit: +process.env.LIMIT,
      nest: true,
      order: [["createdAt", "DESC"]],
      include: [
        { model: db.Image, as: "images", attributes: ["image"] },
        {
          model: db.Attribute, as: "attributes", attributes: ["price", "acreage", "published", "hashtag"],
        },
        {
          model: db.Seller, as: "sellers", attributes: ["name", "phone", "zalo", "avatar"],
        },
        { model: db.Overview, as: "overviews" },

      ],
      // attributes: ["id", "title", "star", "address", "description"],
    });
    resolve({ data: response })
  } catch (error) {
    reject(error)
  }
})

export const updatePostService = ({ postId, attributesId, imagesId, overviewId, ...body }) => new Promise(async (resolve, reject) => {
  try {
    const labelCode = v4(body.label)
    await db.Post.update({
      title: body.title,
      labelCode,
      address: body.address,
      categoryCode: body.categoryCode,
      description: JSON.stringify(body.description) || null,
      areaCode: body.areaCode,
      priceCode: body.priceCode,
      provinceCode: body?.province.includes("Thành phố")
        ? v4(body.province.replace("Thành phố", ""))
        : v4(body.province.replace("Tỉnh", "")),
      priceNumber: body.priceNumber,
      areaNumber: body.areaNumber,
    }, {
      where: { id: postId }
    });
    await db.Attribute.update({
      price: +body.priceNumber < 1
        ? `${+body.priceNumber * 1000000}đồng/tháng`
        : `${+body.priceNumber}triệu đồng/tháng`,
      acreage: `${body.areaNumber}m2`,
    }, {
      where: {
        id: attributesId,
      }
    });
    await db.Image.update({
      image: JSON.stringify(body.images),
    }, {
      where: { id: imagesId }
    });
    await db.Overview.update({
      area: body.label,
      type: body.categoryCode,
      target: body.target,
    }, {
      where: { id: overviewId }
    });
    await db.Province.findOrCreate({
      where: {
        [Op.or]: [
          { value: v4(body.province.replace("Thành phố", '')) },
          { value: v4(body.province.replace("Tỉnh", '')) },
        ]
      },
      defaults: {
        code: body?.province.includes("Thành phố")
          ? v4(body.province.replace("Thành phố", ""))
          : v4(body.province.replace("Tỉnh", "")),
        value: body?.province.includes("Thành phố")
          ? (body.province.replace("Thành phố", ""))
          : (body.province.replace("Tỉnh", "")),
      }
    })
    await db.Label.findOrCreate({
      where: {
        code: labelCode
      },
      defaults: {
        code: labelCode,
        value: body.label
      }
    })
    resolve({
      err: 0,
      msg: 'Update Success'
    })
  } catch (error) {
    reject(error)
  }
})

const deletePostService = (postId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await db.Post.destroy({
        where: { id: postId }
      })
      resolve({
        err: response > 0 ? 0 : 1,
        msg: response > 0 ? "Delete success" : "No post delete",
      })
    } catch (error) {
      reject(error)
    }
  })
}

const getPostArea = (labelCode) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await db.Post.findAndCountAll({
        where: labelCode,
        raw: true,
        include: [
          { model: db.Label, as: "labels", attributes: ["code", "value"] },
          { model: db.Image, as: "images", attributes: ["image"] },
          {
            model: db.Attribute,
            as: "attributes",
            attributes: ["price", "acreage", "published", "hashtag"],
          },
        ],
        attributes: ["id", "title", "star", "createdAt"],
      });
      resolve({
        msg: "oke",
        response,
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getAllPost: getAllPost,
  getPostLimit: getPostLimit,
  getNewPost: getNewPost,
  createNewPost: createNewPost,
  postAdminService: postAdminService,
  updatePostService: updatePostService,
  deletePostService: deletePostService,
  getPostArea: getPostArea
};

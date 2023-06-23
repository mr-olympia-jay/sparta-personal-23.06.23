// routes>posts.route.js

const express = require("express");
const router = express.Router();

// Middleware
const authMiddleware = require("../middlewares/auth-middleware");
// Model
const { Users, Posts } = require("../models");

// 게시글 생성 API (POST)
router
.post("/posts", authMiddleware, async (req, res) => { // 'log-in'이 완료된 사용자만 작성 가능하기 때문에, authMiddleware 등록
  const { userId } = res.locals.user;
  const { title, content } = req.body;

  try {
    if (!title || !content) {
      return res.status(201).json({ message: "Data 형식이 올바르지 않습니다." });
    }
    if (typeof title !== "string") {
      return res.status(201).json({ message: "게시글 제목의 형식이 일치하지 않습니다." });
    }
    if (typeof content !== "string") {
      return res.status(201).json({ message: "게시글 내용의 형식이 일치하지 않습니다." });
    }
    // Posts(table)에 게시물 정보를 추가합니다.
    const user = await Users.findOne({ where: userId })
    await Posts.create({
      UserId: userId,
      Nickname: user.nickname,
      title: title,
      content: content
    });

    return res.status(201).json({ message: "게시글 작성에 성공하였습니다." });
  // try => catch
  } catch {
    return res.status(400).json({ message: "게시글 작성에 실패하였습니다." });
  }
});

// 게시글 조회 API (GET)
router
.get("/posts", async (req, res) => {
  try {
    const posts = await Posts.findAll({
      attributes: ["postId", "UserId", "Nickname", "title", "createdAt", "updatedAt"],
      order: [['createdAt', 'DESC']] // "createAt"을 내림차순 조회
    });

    return res.status(200).json({ "posts": posts });
  } catch {
    return res.status(400).json({ message: "게시글 조회에 실패하였습니다." });
  }
});

// 게시글 상세 조회 API (GET)
router.get("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Posts.findOne({
      attributes: ["postId", "UserId", "title", "content", "createdAt", "updatedAt"],
      where: { postId }
    });

    return res.status(200).json({ data: post });
  } catch {
    return res.status(400).json({ message: "게시글 조회에 실패하였습니다." });
  }
});



// 게시글 수정
router.put("/posts/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { userId } = res.locals.user;
  const { title, content } = req.body;

  // 게시글을 조회합니다.
  const post = await Posts.findOne({ where: { postId } });

  if (!post) {
    return res.status(404).json({ message: "게시글이 존재하지 않습니다." });
  } else if (post.UserId !== userId) {
    return res.status(401).json({ message: "권한이 없습니다." });
  }

  // 게시글의 권한을 확인하고, 게시글을 수정합니다.
  await Posts.update(
    { title, content }, // title과 content 컬럼을 수정합니다.
    {
      where: {
        [Op.and]: [{ postId }, { UserId: userId }],
      }
    }
  );

  return res.status(200).json({ data: "게시글이 수정되었습니다." });
});

module.exports = router;

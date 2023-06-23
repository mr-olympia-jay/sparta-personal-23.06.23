// routes>users.route.js

const express = require("express");
const router = express.Router();

// JWT
const jwt = require("jsonwebtoken")
// Model
const { Users } = require("../models");

// sign-up API (POST)
router
  .post("/signup", async (req, res) => {
    const { nickname, password, confirm } = req.body;
    const existUser = await Users.findOne({ where: { nickname } });

    try {
      if (!nickname || nickname.length < 3 || !/^[a-z A-Z 0-9]+$/.test(nickname)) {
        // 3번째 조건은 정규 표현식이며, '^'은 문자열 시작, '$'은 문자열 끝을 나타냅니다.
        // test() method는 이 정규 표현식을 'nickname' 문자열에 적용하여, 앞에 조건이 일치하는지 여부를 반환합니다.
        return res.status(412).json({ message: "nickname의 형식이 올바르지 않습니다." })
      }
      if (password !== confirm) {
        return res.status(412).json({ message: "password가 일치하지 않습니다." })
      }
      if (!password || password.length < 4) {
        return res.status(412).json({ message: "password 형식이 올바르지 않습니다." })
      }
      if (password.includes(nickname)) {
        return res.status(412).json({ message: "password에 nickname이 포함되어 있습니다." })
      }
      if (existUser) {
        return res.status(412).json({ message: "중복된 nickname입니다." });
      }
      // Users(table)에 사용자 정보를 추가합니다.
      await Users.create({ nickname, password });

      return res.status(201).json({ message: "회원 가입에 성공하였습니다." });
      // try => catch
    } catch {
      return res.status(400).json({ message: "요청한 Data 형식이 올바르지 않습니다." });
    }
  })

// log-in API (POST)
router
  .post("/login", async (req, res) => {
    const { nickname, password } = req.body;
    const existUser = await Users.findOne({ where: { nickname } });
    try {
      if (!existUser || password !== existUser.password) {
        return res.status(412).json({ message: "nickname 또는 password를 확인해주세요." });
      }

      // JWT 생성
      const token = jwt.sign({
        userId: existUser.userId
      }, "customized_secret_key"); // Secret Key => customized_secret_key

      // Cookie 발급
      res.cookie("authorization", `Bearer ${token}`);

      return res.status(200).json({ "token": token });
      // try => catch
    } catch {
      return res.status(400).json({ message: "log-in에 실패하였습니다." });
    }
  })

module.exports = router;

<?php
defined('BASEPATH') OR exit('No direct script access allowed');

use \QCloud_WeApp_SDK\Auth\LoginService as LoginService;
use QCloud_WeApp_SDK\Constants as Constants;
use QCloud_WeApp_SDK\Mysql\Mysql as DB;

class Users extends CI_Controller {
    public function index()
    {
     // mysqli_query(DB, "set names 'utf8'");
        $this->load->database();
        $update = $_GET['update'];
         
        if ($update == 'userInfo') {

            $nickName = $_GET['nickName'];
            $signature = $_GET['signature'];
            $sex = $_GET['sex'];
            $city = $_GET['city'];
            $province = $_GET['province'];
            $country = $_GET['country'];

            $this->db->query("INSERT IGNORE INTO users(nickName,sex,city,province,country)
                                            VALUE ('$nickName',$sex,'$city','$province','$country')");
          
            //  DB::insert('users', [
            //      'nickName' => $nickName,
            //      'signature' => $signature,
            //      'sex' => $sex,
            //      'city' => $city,
            //      'sex' => $sex,
            //      'province' => $province,
            //      'country' => $country,
            //  ]);
            $this->json([
                'code' => 1,
                'data' => [
                    'msg' => 'success'
                ]
            ]);
            return;

        }
        if ($update == 'getOpenId') {

            $code = $_GET['code'];//小程序传来的code值
            $nickName = $_GET['nick'];//小程序传来的用户昵称
            $imgUrl = $_GET['avaurl'];//小程序传来的用户头像地址
            $city = $_GET['city'];
            $province = $_GET['province'];
            $country = $_GET['country'];
            $sex = $_GET['sex'];//小程序传来的用户性别
            $url = 'https://api.weixin.qq.com/sns/jscode2session?appid=wx45090c5e43a84a30&secret=00623b89a44e3d0587efcf4d2a854ce3&js_code=' . $code . '&grant_type=authorization_code';
            //yourAppid为开发者appid.appSecret为开发者的appsecret,都可以从微信公众平台获取；
            $info = file_get_contents($url);//发送HTTPs请求并获取返回的数据，推荐使用curl
            $json = json_decode($info);//对json数据解码
            $arr = get_object_vars($json);
            $openid = $arr['openid'];
            $session_key = $arr['session_key'];

            $con = mysqli_connect('localhost', 'root', 'wx45090c5e43a84a30');//连接数据库
           //   $con = mysqli_connect('localhost', 'root', '7FjgPz2w');//连接数据库
            if ($con) {
                if (mysqli_select_db($con, 'listen-now')) {
                    $sql1 = "select * from user where openid = '$openid'";
                    $result = mysqli_query($con, $sql1);
                    $result = mysqli_fetch_assoc($result);
                    if ($result!=null) {//如果数据库中存在此用户的信息，则不需要重新获取
                        $result = json_encode($result);
                        echo $result;
                    }
                    else {//没有则将数据存入数据库
                        if ($sex == '0') {
                            $sex = 'none';
                        } else {
                            $sex = '1' ? 'man' : 'women';
                        }
                        $sql = "insert into user(nick,imgUrl,sex,openid,session_key,city,province,country)
                                         values ('$nickName','$imgUrl','$sex','$openid','$session_key','$city','$province','$country')";
                        $this->db->query("INSERT IGNORE INTO fav_songs(user_id) VALUE ('$openid')"); //最喜欢歌单
                        $this->db->query("INSERT IGNORE INTO user_collect_lists_name(openid) VALUE ('$openid')"); //收藏歌单
                       
                        if (mysqli_query($con, $sql)) {
                            $arr['nick'] = $nickName;
                            $arr['imgUrl'] = $imgUrl;
                            $arr['sex'] = $sex;
                            $arr = json_encode($arr);
                            echo $arr;
                        } else {
                            die('failed' . mysqli_error($con));
                        }
                    }
                }
            } else {
                die(mysqli_error());
            }

        }


    }}


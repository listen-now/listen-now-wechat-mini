<?php
defined('BASEPATH') OR exit('No direct script access allowed');

use \QCloud_WeApp_SDK\Auth\LoginService as LoginService;
use QCloud_WeApp_SDK\Constants as Constants;
use QCloud_WeApp_SDK\Mysql\Mysql as DB;

class Insert extends CI_Controller {
 public function index()
 {
 $this->load->database();

 $update = $_GET['update'];
 
 if ($update == 'insertMsg') {
 $name = $_GET['name'];
 $num = $_GET['num'];
 $msg = $_GET['msg'];

 $this->db->query("INSERT INTO test(name,num,msg) VALUE ('$name',$num,'$msg')");

 $this->json([
 'code' => 1,
 'data' => [
 'msg' => 'success'
 
 ]
 ]);
 return;

 }
 
 }}


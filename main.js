// @ts-check
import {Client} from './client/client.js';
import * as Map from './map-data.js';

/** 
 * objectName
 * ClassName
 * funcName
 * file-name
 * folder-name
 */

/**
 * show    : 보여주기
 * 
 * get     : 값 반환
 * calc    : 계산 값 반환
 * create  : 객체 생성 및 반환?
 * check   : 상태 논리값 반환
 * is      : 타입 논리값 반환
 * transform??
 * 
 * handle  : 이벤트 처리
 * set     : 값 설정
 * update  : 상태 변경
 * clear   : 지우기
 * perform : 작업 수행
 */

/**
 * 브라우져 전역 데이터
 */

addEventListener('load',
  () => {
    const mainNode = document.querySelector('main');
    if (!mainNode) return;
    new Client(mainNode, Map.size, Map.data, Map.palette);
  }, {once : true}
)
oncontextmenu = e => e.preventDefault();
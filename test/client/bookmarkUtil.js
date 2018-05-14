const test = require('tape')
const testHelper = require('../testHelper')
const timekeeper = require('timekeeper')
const bookmarkUtil = require('../../client/bookmarkUtil')


test('test bookmarkUtil', (t) => {
  t.plan(8)
  t.equals(bookmarkUtil.getBaseBookmarksOrder('0', 'ios'), '2.0.')
  t.equals(bookmarkUtil.getBaseBookmarksOrder('0', 'android'), '2.0.')
  t.equals(bookmarkUtil.getBaseBookmarksOrder('0', 'laptop'), '1.0.')
  t.equals(bookmarkUtil.getBookmarkOrder('', '2.0.9'), '2.0.8')
  t.equals(bookmarkUtil.getBookmarkOrder('2.0.8', ''), '2.0.9')
  t.equals(bookmarkUtil.getBookmarkOrder('2.0.8', '2.0.9'), '2.0.8.1')
  t.equals(bookmarkUtil.getBookmarkOrder('2.0.8', '2.0.8.1'), '2.0.8.0.1')
  t.equals(bookmarkUtil.getBookmarkOrder('2.0.8.1', '2.0.9'), '2.0.8.2')
})

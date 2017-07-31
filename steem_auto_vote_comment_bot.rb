#!/usr/bin/env ruby

require 'radiator'

class Bot

  attr_reader :radiator_client, :bot_name, :wif, :active, :logger

  def watch_for_introductions(bot_name, wif, active)
    @bot_name = bot_name
    @wif = wif
    @active = active
    @logger = Logger.new(STDOUT)
    @logger.level = Logger::INFO
    @logger.formatter = proc { |severity,datetime,progname,msg| "#{datetime} - #{severity} - #{msg}\n" }

    @radiator_client = Radiator::Transaction.new(url: 'https://steemd.steemit.com', wif: wif)

    begin
      Radiator::Stream.new.operations(:comment) do |op|
        matching_tags = begin
          op_tags = JSON.parse(op['json_metadata'])['tags']
          if op_tags.class == Array
            ['introducing','introducemyself','introduceyourself','whalepower'] & op_tags
          else
            ['introducing','introducemyself','introduceyourself','whalepower'] & ((op_tags || '').split(','))
          end
        rescue JSON::ParserError => e
          logger.debug { "[Bot #{__method__} Warning: #{e}".light_blue }
          logger.debug { "[Bot #{__method__} Operation: #{op}".light_blue}
          []
        end

        if !matching_tags.empty?
          generated_vote_tx = Radiator::Operation.new({
            type: :vote,
            voter: bot_name,
            author: op['author'],
            permlink: op['permlink'],
            weight: 10
          })
          comment_permlink = "welcome-to-steem-love-#{bot_name.downcase.gsub(/(\.|\_)/,'-')}-#{Time.now.to_i}"
          generated_comment_tx = Radiator::Operation.new({
            type: :comment,
            author: bot_name,
            permlink: comment_permlink,
            title: "Welcome to SteemIt. Love @#{bot_name}",
            body: welcome_text(op['author']),
            parent_permlink: op['permlink'],
            parent_author: op['author'],
            json_metadata: {
              tags: 'introduceyourself',
              app: 'steemAuto/1.0',
              format: 'markdown+html',
              community: 'buildteam'
            }.to_json
          })
          generated_kickback_tx = Radiator::Operation.new({
            type: :comment_options,
            author: bot_name,
            permlink: comment_permlink,
            percent_steem_dollars: 10000,
            max_accepted_payout: '1000000.000 SBD',
            allow_votes: true,
            allow_replies: true,
            allow_curation_rewards: true,
            extensions: Radiator::Type::Beneficiaries.new(netuoso: 1000)
           })

          if active
            op_author = Radiator::Api.new.find_account(op['author'])
            if op_author['post_count'].to_i < 2
              logger.debug { "[Bot #{__method__}] Processing Operations".pink }

              radiator_client.operations << generated_vote_tx
              radiator_client.operations << generated_comment_tx
              radiator_client.operations << generated_kickback_tx

              radiator_response = radiator_client.process(true)
              if radiator_response.error
                logger.error { "[Bot #{__method__}] Error: #{radiator_response.error}".red }
              else
                logger.info { "[Bot #{__method__}] Success: #{radiator_response.result}".green }
              end
            else
              logger.warn { "[Bot #{__method__}] Skipping: User #{op['author']} #{(Time.now.to_i - Time.parse(op_author['created']).to_i)/3600/24} days old with #{op_author['post_count'].to_i} posts.".yellow }
            end
          else
            logger.warn { "[Bot #{__method__}] In read only mode. Not voting. Skipping ops: #{radiator_client.operations}".yellow }
          end
        end
      end
    rescue Net::OpenTimeout => e
      logger.error { "[Bot #{__method__} Error: #{e}" }
      return
    end
  end

  private

  def welcome_text(author)
    %Q{**Welcome to Steemit #{author} :)**

![Welcome Bot Banner](http://i.imgur.com/ayPq3QU.png)

Here are some helpful tips to get you started:
* [Get early support by the Minnow Support Project join on Discord](https://discord.gg/HYj4yvw)

---

[Make sure to Follow @#{bot_name}](https://steemit.com/@#{bot_name})}
  end

  def help_text
    %Q{#{('*'*50).green}

#{'Dependencies:'.yellow}
#{'gem install radiator'.light_blue}

#{'Requires arguments:'.yellow}
#{'bot_name, posting_key, active'.light_blue}

#{'Note:'.yellow}
#{'Setting active to true will make the bot actually vote/comment'.light_blue}

#{'Ex:'.yellow}
#{'ruby steem_auto_vote_comment_bot.rb netuoso 5KYOURPRIVATEPOSTINGKEY true'.light_blue}

#{('*'*50).green}}
  end

end

class String
  # colorization
  def colorize(color_code)
    "\e[#{color_code}m#{self}\e[0m"
  end

  def red
    colorize(31)
  end

  def green
    colorize(32)
  end

  def yellow
    colorize(33)
  end

  def blue
    colorize(34)
  end

  def pink
    colorize(35)
  end

  def light_blue
    colorize(36)
  end
end

if ARGV.count == 3
  Bot.new.watch_for_introductions(ARGV[0], ARGV[1], ARGV[2])
elsif ARGV.count == 2
  Bot.new.watch_for_introductions(ARGV[0], ARGV[1], "false")
else
  puts Bot.new.send(:help_text)
end
